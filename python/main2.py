import RPi.GPIO as GPIO
import time
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from math import sqrt

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="PFA",  # Votre utilisateur
        password="password123",  # Votre mot de passe
        database="PFA",
        port=3306
    )

app = FastAPI()
#cors config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autoriser votre origine JS
    allow_credentials=True,
    allow_methods=["*"],  # Autoriser toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],  # Autoriser tous les en-têtes
)

#initialisation
GPIO.setmode(GPIO.BCM)

##analogic
# Initialisation de l'interface I2C
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c, address=0x48)

# Création d’un canal analogique

# Calibration (à ajuster) pour le modul d'humidité de sol
dry_value = 20000  # Valeur pour sol sec (à mesurer avec 3.3V)
wet_value = 10000  # Valeur pour sol humide (à mesurer avec 3.3V)

# Modèle pour valider les données reçues

def map_humidity(raw_value):#humidité de sol
    humidity = 100 - ((raw_value - wet_value) * 100) / (dry_value - wet_value)
    if humidity > 100:
        humidity = 100
    if humidity < 0:
        humidity = 0
    return round(humidity, 2)

def mesurer_distance():#ultra-son
    
    GPIO.setmode(GPIO.BCM)
    pins = [26, 13, 5, 21]

    for pin in pins:
        GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    capteurs_actifs = [pin for pin in pins if GPIO.input(pin) == GPIO.LOW]
    niveau = len(capteurs_actifs)

    return niveau*25

def lire_dht11(pin):#temperature et humidité
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, GPIO.LOW)
    time.sleep(0.018)  # Signal bas de 18 ms
    GPIO.output(pin, GPIO.HIGH)
    time.sleep(0.00004)  # Signal haut de 40 µs
    GPIO.setup(pin, GPIO.IN)
    
    # Attendre la réponse du capteur avec timeout
    timeout = time.time() + 0.001  # 1 ms max
    while GPIO.input(pin) == GPIO.LOW:
        if time.time() > timeout:
            return None, None  # Échec si timeout
    timeout = time.time() + 0.001
    while GPIO.input(pin) == GPIO.HIGH:
        if time.time() > timeout:
            return None, None
    
    # Lire les 40 bits avec timeout
    data = []
    for i in range(40):
        # Attendre l'impulsion basse
        timeout = time.time() + 0.0001  # 100 µs max pour LOW
        while GPIO.input(pin) == GPIO.LOW:
            if time.time() > timeout:
                return None, None
        
        # Mesurer l'impulsion haute
        debut = time.time()
        timeout = time.time() + 0.0001  # 100 µs max pour HIGH
        while GPIO.input(pin) == GPIO.HIGH:
            if time.time() > timeout:
                return None, None
        duree = time.time() - debut
        data.append(1 if duree > 0.00005 else 0)
    
    # Décoder les données
    humidite = int("".join(map(str, data[0:8])), 2)
    temperature = int("".join(map(str, data[16:24])), 2)
    checksum = int("".join(map(str, data[32:40])), 2)
    
    # Vérifier la somme de contrôle
    if (humidite + int("".join(map(str, data[8:16])), 2) + temperature + int("".join(map(str, data[24:32])), 2)) & 0xFF == checksum:
        return humidite, temperature
    return None, None

def ldr(val):#mesure ldr
    return val/3.3*100

def get_pin_id(plant_id,pin_type):#recupere l'id du pin
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = "select pi.id_pin from Plant pl,Pin_Plant pp,Pin pi,SensorType s where pl.id_plant=pp.id_plant and pp.id_pin=pi.id_pin and pi.id_sensor_type=s.id_sensor_type and pl.id_plant=%s and s.nom=%s"
        cursor.execute(query, (plant_id, pin_type))

        results = cursor.fetchall()[0][0]
        if results.startswith('GPIO'):
            return(int(results[4:]))
        elif results.startswith('A'):
            match int(results[1:]):
                case 0:
                    return AnalogIn(ads, ADS.P0)
                case 1:
                    return AnalogIn(ads, ADS.P1)
                case 2:
                    return AnalogIn(ads, ADS.P2)
                case 3:
                    return AnalogIn(ads, ADS.P3)
                case _:
                    raise ValueError("La valeur doit être 0, 1, 2 ou 3")
        
    except mysql.connector.Error as err:
        print(f"Erreur : {err}")
        return None
    finally:
        cursor.close()
        connection.close()

def relay(state,pin):#utilisation du moteur
    GPIO.setup(pin, GPIO.OUT)
    if state not in [0, 1, 2]:
        return {"error": "La valeur doit être 0 ou 1"}
    
    if state != 2:
        # Contrôler le relais
        GPIO.output(pin, GPIO.HIGH if state == 0 else GPIO.LOW)
    
    # Renvoyer une confirmation
    return {
        "message": "Commande exécutée",
        "relay_state": "etain" if GPIO.input(pin)==1 else "marche"
    }

def insert_var(pin,val):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO Val (date,id_pin, valeur) VALUES (%s,%s, %s)", (int(round(time.time() * 1000)),pin, val))
    connection.commit()

def add_notif(id_plant,type,title,contenu):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor2 = connection.cursor()
    cursor2.execute("SELECT * FROM Notif where time > %s and id_plant=%s and contenu = %s",(str(int(round(time.time() * 1000)-1000*60*60*12)),id_plant,contenu))
    results = cursor2.fetchall()
    if len(results)==0 or type =="success":
        cursor.execute("INSERT INTO Notif (time,id_plant,type,title,contenu) VALUES (%s,%s,%s,%s,%s)", (int(round(time.time() * 1000)),id_plant,type,title,contenu))
    connection.commit()
def remove_notif(id_plant,contenu):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("delete from Notif where id_plant=%s and contenu=%s",(id_plant,contenu))

    connection.commit()
#------------main------------
humidite, temperature, old_humidite, old_temperature=0,0,0,0
connection = get_db_connection()
cursor = connection.cursor()
cursor2 = connection.cursor()
i=0
while 1:
    cursor.execute("select id_plant from Plant")
    results = cursor.fetchall()[0]
    for id in results:
        plant_id=id
        query2="SELECT s.id_sensor_type,s.nom,p.id_pin FROM SensorType s, Pin_Plant pp, Pin p where p.id_pin=pp.id_pin and p.id_sensor_type=s.id_sensor_type and pp.id_plant=%s"
        cursor2.execute(query2, (plant_id,))
        results2 = cursor2.fetchall()
        for res in results2:
            if res[1]=="humidite air":
                pin=get_pin_id(plant_id,"humidite air")
                if humidite is not None and temperature is not None:
                        old_humidite, old_temperature = humidite, temperature
                humidite, temperature = lire_dht11(pin)
                if humidite is None or temperature is None:
                    insert_var(res[2],str(old_temperature)+"°C")
                    insert_var(res[2],old_humidite)
                else:
                    insert_var(res[2],str(temperature)+"°C")
                    insert_var(res[2],humidite)
            elif res[1]=="humidite sol":
                chanal=get_pin_id(plant_id,"humidite sol")
                val=map_humidity(chanal.value)
                insert_var(res[2],val)

            elif res[1]=="luminosite":
                chanal2=get_pin_id(plant_id,"luminosite")
                val2=ldr(chanal2.voltage)
                insert_var(res[2],val2)
        
            # val=mesurer_distance()
            
            if mesurer_distance()<=25:
                add_notif(plant_id,"Warning","low water tank level","3abini plz rak bech to9tel el nabta")
            else:
                remove_notif(plant_id,"3abini plz rak bech to9tel el nabta")
            if res[1]=="humidite sol":
                if  val<=40:
                    add_notif(plant_id,"Warning","che7t","es9iwni")
                else:
                    remove_notif(plant_id,"es9iwni")
            if res[1]=="luminosite":
                if val2<=40:
                    add_notif(plant_id,"Warning","bret","nawarha a3leya plz")
                else:
                    remove_notif(plant_id,"nawarha a3leya plz")
            if res[1]=="humidite air":
                if old_humidite<=40:
                    add_notif(plant_id,"Warning","ncheft","belni chewaya")
                else:
                    remove_notif(plant_id,"belni chewaya")
                
                if old_temperature <=0:
                    add_notif(plant_id,"Warning","baarrrd","dafini")
                else:
                    remove_notif(plant_id,"dafini")
        
        
        if 'old_humidite' not in locals():
            old_humidite=50
        if 'old_temperature' not in locals():
            old_temperature=20
        if 'val' not in locals():
            val=40
        if 'val2' not in locals():
            val2=0.5
        debit =1 # en ml/s
        eau=(old_temperature*(1-old_humidite/100))*(1-val/100)*sqrt(val2/100)*20#<- coeffisiotn de stabilisation entre 10 et 30
        pin=get_pin_id(plant_id,"pompe a eau")
        if i>10*60*60/5:
            # relay(1,pin)
            # time.sleep(eau/debit)
            # relay(0,pin)
            print("es9i")#a effacer

    i+=1
    time.sleep(5)
        
        

        




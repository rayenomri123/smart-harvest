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
wet_value = 5000  # Valeur pour sol humide (à mesurer avec 3.3V)

# Modèle pour valider les données reçues
class RelayCommand(BaseModel):
    state: int  # 0 pour éteindre, 1 pour allumer,2 pour recupere la valeur
    
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

#------------main------------
humidite, temperature, old_humidite, old_temperature=0,0,0,0
max_dist = 50
@app.get("/api/distance")
async def h_sol(plant_id: int):
    return {"distance":mesurer_distance()}#cm

@app.get("/api/humidity_sol")
async def h_sol(plant_id: int):
    chanal=get_pin_id(plant_id,"humidite sol")
    return {"humiditer_sol":map_humidity(chanal.value)}

@app.get("/api/ldr")
async def h_sol(plant_id: int):
    chanal=get_pin_id(plant_id,"luminosite")
    return {"Luminosite":ldr(chanal.voltage)}

@app.get("/api/temp_humidity")
async def hum_temp(plant_id: int):
    pin=get_pin_id(plant_id,"humidite air")
    global humidite, temperature, old_humidite, old_temperature
    
    if humidite is not None and temperature is not None:
            old_humidite, old_temperature = humidite, temperature
    humidite, temperature = lire_dht11(pin)
    if humidite is None or temperature is None:
        return {"temp":old_temperature,"humidity":old_humidite}
    else:
        return {"temp":temperature,"humidity":humidite}

@app.post("/api/relay")
async def control_relay(command: RelayCommand,plant_id: int):
    pin=get_pin_id(plant_id,"pompe a eau")
    
    return relay(command.state,pin)


@app.on_event("shutdown")
def cleanup():
    GPIO.cleanup()

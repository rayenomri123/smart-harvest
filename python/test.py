
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

GPIO.setmode(GPIO.BCM)

##analogic
# Initialisation de l'interface I2C
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c, address=0x48)

chanal = AnalogIn(ads, ADS.P0)
while 1:
    print(chanal.value)

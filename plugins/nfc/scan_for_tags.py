#!/usr/bin/env python

"""
Continuously scan for NFC tags and print their UIDs, one per line.

Once we scan an ID, we'll only print it again if we scan something else first, or scan nothing for 5 seconds.

"""

import RPi.GPIO as GPIO
from pn532 import *
import sys

GPIO.setwarnings(False)

try:
    pn532 = PN532_I2C(debug=False, reset=20, req=16)

    ic, ver, rev, support = pn532.get_firmware_version()
    
    # Configure PN532 to communicate with MiFare cards
    pn532.SAM_configuration()

    last_string = ''

    while True:
        uid = pn532.read_passive_target(timeout=5)

        if uid is None:
            last_string = ''
            continue

        string = ' '.join([hex(x) for x in uid])

        if string != last_string:
            print('FOUND ' + string)
            sys.stdout.flush() # Else Node won't see the output
            last_string = string

except Exception as e:
    print(e)
finally:
    GPIO.cleanup()


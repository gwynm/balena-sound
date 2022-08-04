#!/usr/bin/env python

"""
Continuously scan for NFC tags and print their UIDs, one per line.
"""

import RPi.GPIO as GPIO
from pn532 import *

if __name__ == '__main__':
    try:
        pn532 = PN532_I2C(debug=False, reset=20, req=16)

        ic, ver, rev, support = pn532.get_firmware_version()
        
        # Configure PN532 to communicate with MiFare cards
        pn532.SAM_configuration()

        while True:
            uid = pn532.read_passive_target(timeout=5)
            print('.', end="")
            if uid is None:
                continue
            print([hex(i) for i in uid])
    except Exception as e:
        print(e)
    finally:
        GPIO.cleanup()


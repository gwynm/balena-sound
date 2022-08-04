#!/usr/bin/env python

import time
import sys

def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

print("Hello World!1")
eprint("Hello World!e")
sys.stdout.flush()
time.sleep(5)
print("Hello World!2")
eprint("Hello World!2e ")
sys.stdout.flush()
time.sleep(5)
print("Hello World!3")
eprint("Hello World!3e")
sys.stdout.flush()
time.sleep(5)
print("Hello World!4")
eprint("Hello World!4e")
sys.stdout.flush()
time.sleep(5)
print("Hello World!5")
eprint("Hello World!5e")
sys.stdout.flush()
time.sleep(5)

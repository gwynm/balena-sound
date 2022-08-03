#!/usr/bin/env bash
for (( ; ; ))
do
  echo "Sending IR commands"
  ir-ctl --dev=/dev/lirc0 --send=volume-down.dat
  ir-ctl --dev=/dev/lirc0 --send=volume-up.dat
  sleep 120
done

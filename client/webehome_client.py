import argparse
import logging
import requests
import time
import datetime

from pybehome import PyBeHome
from pybehome.constants import (ARM_HOME, ARM_AWAY, DISARM)

_LOGGER = logging.getLogger(__name__)

COMMAND_LOCATION = 'location'
COMMAND_DEVICES = 'devices'
COMMAND_ARM = 'arm'


def main():
    """Start PyBeHome command line."""
    parser = argparse.ArgumentParser('PyBeHome: Command Line Utility')
    parser.add_argument(
        '-u', '--username',
        help='Username', required=True)
    parser.add_argument(
        '-p', '--password',
        help='Password', required=True)
    parser.add_argument(
        '-l', '--location',
        help='Location id')

    commandsparser = parser.add_subparsers(
        help='commands',
        dest='command')

    commandsparser.add_parser(
        COMMAND_LOCATION,
        help='Get location data')
    commandsparser.add_parser(
        COMMAND_DEVICES,
        help='Get all device data')

    set_alarm = commandsparser.add_parser(
        COMMAND_ARM,
        help='Set alarm level')

    set_alarm.add_argument(
        'level',
        choices=[
            ARM_HOME,
            ARM_AWAY,
            DISARM],
        help='Alarm level')

    parser.add_argument(
        '--debug',
        help='Enable debug logging',
        required=False, default=False, action="store_true")
    parser.add_argument(
        '--loop',
        help='Loop infinity',
        required=False, default=False, action="store_true")
    parser.add_argument(
        '--quiet',
        help='Output only warnings and errors',
        required=False, default=False, action="store_true")

    args = parser.parse_args()

    if args.debug:
        log_level = logging.DEBUG
    elif args.quiet:
        log_level = logging.WARN
    else:
        log_level = logging.INFO

    logging.basicConfig(level=log_level)
    #print("Starting")
    pybehome = PyBeHome(args.username, args.password)
    pybehome.login()
    #print("LOGIN DONE")

    if args.command == COMMAND_LOCATION:
        print("Command Location")
        pybehome.update_location()
        print(pybehome.get_location())
    if args.command == COMMAND_DEVICES:
        #print("Devices");
        count = 0
        while True:
            counting = 1
            pybehome.update_devices()
            for device in pybehome.get_devices():
                print(device)
                if device.display_type not in [300, 310]:
                    continue
                #print(device.name, " ", device.last_event_data, " ",device.battery_level)

                d = {'hid': counting, 'device': device.name, 'status': device.last_event_data, 'publish_date': device.last_event_time,
                     'publisher': 'Webehome',
                     'value': device.battery_level}
                requests.post("http://localhost:8080/device/" + str(counting), data=d)
                counting = counting + 1
                #print(device)
                datetime_object = datetime.datetime.now()
                dm = {'hid': '100', 'device': 'webehome', 'status': 'open',
                     'publish_date': datetime_object,
                     'publisher': 'Webehome_client',
                     'value': '100'}
                requests.post("http://localhost:8080/device/100", data=dm)
            count += 1
            print('count: ', count)
            if not args.loop:
                break
            time.sleep(1)
    if args.command == COMMAND_ARM:
        print(pybehome.set_alarm_state(args.level))

    pybehome.token_destroy()



if __name__ == "__main__":
    main()

import argparse
import os
import sys
import yaml
import requests
import datetime

# required arg
basepath = os.path.dirname(os.path.abspath(__file__))
ymlfile = basepath + "/../devices.yaml"

def readyaml(yfile):
    with open(yfile) as f:
        data = yaml.load(f, Loader=yaml.FullLoader)
        #print(data)
    return data

parser = argparse.ArgumentParser()

parser.add_argument('--hid', required=False)
parser.add_argument('--list', action='store_true')
parser.add_argument('--update',help='Update restfull',
        required=False, default=False, action='store_true')
parser.add_argument('--loop',help='Loop infinity',
        required=False, default=False, action='store_true')

args = parser.parse_args()

try:
            # Read Configurations yaml config file
            yconfig = readyaml(ymlfile)
except:
            print("Failed read yaml file: ",ymlfile)
            sys.exit(1)

for device in yconfig:
    #print("device HID: ", yconfig[device]['publisher'])
    #print("device:", device)
    if yconfig[device]['publisher'] == "telldustemp_client.sh":
        print("device HID: ", yconfig[device])
        datetime_object = datetime.datetime.now()
        d = {'hid': yconfig[device]['hid'], 'device': yconfig[device]['device'], 'status': 'Open',
             'publish_date': datetime_object,
             'publisher': 'telldustemp_client.py',
             'value': '21'}
        requests.post("http://localhost:8080/device/" + yconfig[device]['hid'], data=d)



    #if yconfig[device]['hid'][device]['publisher'] not in 'telldustemp_client.sh':
    #    continue
    #print("found: ", yconfig['devices']['hid'][dat])


#d = {'hid': '10', 'device': device.name, 'status': device.last_event_data, 'publish_date': device.last_event_time,
#                     'publisher': 'Webehome',
#                     'value': device.battery_level}
#print("Listing devices", yconfig['devices']['hid'][1])
##for dat in yconfig['devices']['hid']:
##    print(dat)
##    if yconfig['devices']['hid'][dat]['publisher'] not in 'telldustemp_client.sh':
##        continue
##    print("found: ", yconfig['devices']['hid'][dat])
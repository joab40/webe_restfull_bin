import requests
import sys
import pprint

from requests.exceptions import Timeout

import argparse

# required arg

parser = argparse.ArgumentParser()

parser.add_argument('--hid', required=False)
parser.add_argument('--list', action='store_true')

args = parser.parse_args()

if args.list:
    print("List True")
    try:
        response = requests.get('http://localhost:8080/device/', timeout=1)
    except Timeout:
        print('The request timed out')
        sys.exit(100)
    else:
        #print('The request did not time out')
        data=response.json()
        pprint.pprint(response.json())

if args.hid:
    try:
        response = requests.get('http://localhost:8080/device/' + args.hid, timeout=1)
    except Timeout:
        print('The request timed out')
        sys.exit(100)
    else:
        #print('The request did not time out')

        data=response.json()
        print('device:',data['device'],'value',data['value'],'status:',data['status'])

        #print(response.json())

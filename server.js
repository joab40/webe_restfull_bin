

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
const port = 8080;

function appendObjTo(thatArray, newObj) {
  const frozenObj = Object.freeze(newObj);
  //return Object.freeze(thatArray.concat(frozenObj));
  return thatArray.concat(frozenObj);
}

var inputfile = 'devices.yaml',
    outputfile = 'devices.json',
    yaml = require('js-yaml'),
    fs = require('fs'),
    obj = yaml.load(fs.readFileSync(inputfile, {encoding: 'utf-8'}));
    var datat = JSON.stringify(obj)

    const values = Object.keys(obj)
    //let devices = [];
    //let devices = Object.create( null );
    let odevices = [];
    values.forEach(element => {
    odevices = appendObjTo(odevices, obj[element]);
     })
     //console.log(devices)
     fs.writeFileSync(outputfile, JSON.stringify(obj, null, 2));

let ddevices = [
{
    "hid": "100",
    "device": "Webehome",
    "status": "Closed",
    "publish_date": "0",
    "publisher": "Working_client",
    "value": 100,
}
];

let devices = []
devices = odevices

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/device', (req, res) => {
    const device = req.body;

    // output the device to the console for debugging
    console.log(device);
    devices.push(device);

    res.send('Device is added to the database');
});

app.get('/device', (req, res) => {
    res.json(devices);
});

app.get('/device/:hid', (req, res) => {
    // reading isbn from the URL
    const hid = req.params.hid;

    // searching devices for the isbn
    for (let device of devices) {
        if (device.hid === hid) {
            res.json(device);
            console.log(`Restfull found returned hid ${hid}!`)
            return;
        }
    }

    // sending 404 when not found
    res.status(404).send('Device not found');
});

app.delete('/device/:hid', (req, res) => {
    // reading isbn from the URL
    const hid = req.params.hid;

    // remove item from the devices array
    devices = devices.filter(i => {
        if (i.hid !== hid) {
            return true;
        }

        return false;
    });

    // sending 404 when not found something is a good practice
    res.send('Device is deleted');
});

app.post('/device/:hid', (req, res) => {
    // reading isbn from the URL
    const hid = req.params.hid;
    //const newDevice = req.body;
    const newDevice = JSON.parse(JSON.stringify(req.body));
    //console.log(newDevice)

    // remove item from the devices array
    for (let i = 0; i < devices.length; i++) {
        let device = devices[i]

        if (device.hid === hid) {
            devices[i] = newDevice;
            //newDevice.publisher;
            //console.log(`Restfull post hid ${hid}!`)
            //console.log(newDevice.publisher)
            //console.log(devices[i].publisher)
            //console.log(devices)
        }
    }

    // sending 404 when not found something is a good practice
    res.send('Device is edited');
    //console.log("Device id edit")
    //console.log(res)
});

app.use(express.static('public'))
//app.use(express.static('files'))
app.use('/admin_client', express.static('public'))
// const routeIndex = require("./admin_client/");
// app.use("/admin_client", routeIndex);

app.listen(port, () => console.log(`Restfull device app listening on port ${port}!`));

// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------




const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
const port = 8080;



let devices = [{
    "hid": "1",
    "device": "GillestugaEntre",
    "status": "Closed",
    "publish_date": "2020-02-01",
    "publisher": "Webehome",
    "value": 100,
},
{
    "hid": "2",
    "device": "GrovEntre",
    "status": "Closed",
    "publish_date": "2020-02-01",
    "publisher": "Webehome",
    "value": 100,
},
{
    "hid": "3",
    "device": "GrovEntre",
    "status": "Closed",
    "publish_date": "2020-02-01",
    "publisher": "Webehome",
    "value": 100,
},
{
    "hid": "4",
    "device": "GrovEntre",
    "status": "Closed",
    "publish_date": "2020-02-01",
    "publisher": "Webehome",
    "value": 100,
},
{
    "hid": "5",
    "device": "GrovEntre",
    "status": "Closed",
    "publish_date": "2020-02-01",
    "publisher": "Webehome",
    "value": 100,
},
];

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
    const newDevice = req.body;

    // remove item from the devices array
    for (let i = 0; i < devices.length; i++) {
        let device = devices[i]

        if (device.hid === hid) {
            devices[i] = newDevice;
        }
    }

    // sending 404 when not found something is a good practice
    res.send('Device is edited');
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


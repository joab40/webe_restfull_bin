const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
const port = 8080;

let books = [{
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

app.post('/book', (req, res) => {
    const book = req.body;

    // output the book to the console for debugging
    console.log(book);
    books.push(book);

    res.send('Device is added to the database');
});

app.get('/book', (req, res) => {
    res.json(books);
});

app.get('/book/:hid', (req, res) => {
    // reading isbn from the URL
    const hid = req.params.hid;

    // searching books for the isbn
    for (let book of books) {
        if (book.hid === hid) {
            res.json(book);
            return;
        }
    }

    // sending 404 when not found something is a good practice
    res.status(404).send('Book not found');
});

app.delete('/book/:hid', (req, res) => {
    // reading isbn from the URL
    const hid = req.params.hid;

    // remove item from the books array
    books = books.filter(i => {
        if (i.hid !== hid) {
            return true;
        }

        return false;
    });

    // sending 404 when not found something is a good practice
    res.send('Device is deleted');
});

app.post('/book/:hid', (req, res) => {
    // reading isbn from the URL
    const hid = req.params.hid;
    const newBook = req.body;

    // remove item from the books array
    for (let i = 0; i < books.length; i++) {
        let book = books[i]

        if (book.hid === hid) {
            books[i] = newBook;
        }
    }

    // sending 404 when not found something is a good practice
    res.send('Device is edited');
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

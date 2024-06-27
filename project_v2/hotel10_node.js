const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const guestRouter = express.Router();
const adminRouter = express.Router();
const { rateLimit } = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})

const app = express();
app.disable('x-powered-by');
const port = 8000;

app.use(bodyParser.json());
app.use(limiter)

app.use(cookieParser())
const csrfProtection = csrf({ cookie: true })

guestRouter.get('/src/hotel10.html', (req, res) => {
    res.sendFile('/src/hotel10.html', { root: __dirname });
});

guestRouter.get('/src/hotel10.js', (req, res) => {
    res.sendFile('/src/hotel10.js', { root: __dirname });
});

guestRouter.get('/rooms', async (req, res) => {
    const client = new MongoClient('mongodb+srv://admin:admin@cluster0.szu7uaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    await client.connect();
    console.log('Connected successfully to server - rooms');

    const db = client.db('HOTEL');
    const collection = db.collection('rooms');
    const data = await collection.find().toArray();
    console.log(data);
    client.close();
    res.json(data);
});

guestRouter.get('/reservations', async (req, res) => {
    const client = new MongoClient('mongodb+srv://admin:admin@cluster0.szu7uaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    await client.connect();
    console.log('Connected successfully to server - reservations');

    const db = client.db('HOTEL');
    const collection = db.collection('reservations');
    const data = await collection.find().toArray();
    client.close();
    res.json(data);
});

guestRouter.get('/public/images/1.jpg', (req, res) => {
    res.sendFile('/public/images/1.jpg', { root: __dirname });
});

guestRouter.get('/public/images/2.jpg', (req, res) => {
    res.sendFile('/public/images/2.jpg', { root: __dirname });
});

guestRouter.get('/public/images/3.jpg', (req, res) => {
    res.sendFile('/public/images/3.jpg', { root: __dirname });
});

guestRouter.post('/book', async (req, res) => {
    console.log('POST');
    
    try {
        const body = req.body;
        console.log(body);

        const number = parseInt(body.number);
        const name = String(body.name);
        const surname = String(body.surname);
        const arrival = String(body.arrival);
        const departure = String(body.departure);
        const price = parseInt(body.price);

        const reservation = {number: number, guest: `${name} ${surname}`, arrival: arrival, departure: departure, price: price};

        const client = new MongoClient('mongodb+srv://admin:admin@cluster0.szu7uaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        await client.connect();
        console.log('Connected successfully to server - POST');

        const db = client.db('HOTEL');
        const roomsDB = db.collection('rooms');
        const reservationsDB = db.collection('reservations');

        await roomsDB.updateOne(
            { number: number },
            { $push: { guests: `${name} ${surname}`} }
        )

        await reservationsDB.insertOne(reservation, (insertErr, result) => {
            if (insertErr) {
              console.error('Error inserting document:', insertErr);
              res.status(500).send('Server error');
            }            
        });
        client.close();
        res.json(reservation);
        console.log(reservation);
    } catch (err) {
        console.trace(err);
        console.error('Error handling POST request:', err);
        res.status(500).send('Server error');
    }
});

guestRouter.post('/login', async (req, res) => {
    const body = req.body;
    const USERlogin = String(body.login); 
    const USERpassword = String(body.password);

    console.log(USERlogin);
    console.log(USERpassword);

    try {
        const data = JSON.parse(await fs.readFile('./public/passwd.json', 'utf8'));
        const user = data.find(user => user.id === USERlogin);
        console.log(user);
        if (user && user.password === USERpassword) {
            res.json({ status: 'OK' });
        } else {
            res.json({ status: 'ERROR' });
        }
    } catch (err) {
        console.trace(err);
        res.status(500).send('Server error');
    }
});

guestRouter.get('/', (req, res) => {
    res.redirect('/src/hotel10.html');
});

adminRouter.get('/src/admin.html', (req, res) => {
    res.sendFile('/src/admin.html', { root: __dirname });
});

adminRouter.get('/src/admin.js', (req, res) => {
    res.sendFile('/src/admin.js', { root: __dirname });
});

adminRouter.get('/rooms', async (req, res) => {
    const client = new MongoClient('mongodb+srv://admin:admin@cluster0.szu7uaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    await client.connect();
    console.log('Connected successfully to server - rooms');

    const db = client.db('HOTEL');
    const collection = db.collection('rooms');
    const data = await collection.find().toArray();
    console.log(data);
    client.close();
    res.json(data);
});

adminRouter.get('/reservations', async (req, res) => {
    const client = new MongoClient('mongodb+srv://admin:admin@cluster0.szu7uaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    await client.connect();
    console.log('Connected successfully to server - reservations');

    const db = client.db('HOTEL');
    const collection = db.collection('reservations');
    const data = await collection.find().toArray();
    client.close();
    res.json(data);
});

adminRouter.get('/public/images/1.jpg', (req, res) => {
    res.sendFile('/public/images/1.jpg', { root: __dirname });
});

adminRouter.get('/public/images/2.jpg', (req, res) => {
    res.sendFile('/public/images/2.jpg', { root: __dirname });
});

adminRouter.get('/public/images/3.jpg', (req, res) => {
    res.sendFile('/public/images/3.jpg', { root: __dirname });
});

adminRouter.post('/book', async (req, res) => {
    console.log('POST');
    
    try {
        const body = req.body;
        console.log(body);

        const number = parseInt(body.number);
        const name = String(body.name);
        const surname = String(body.surname);
        const arrival = String(body.arrival);
        const departure = String(body.departure);
        const price = parseInt(body.price);

        const reservation = {number: number, guest: `${name} ${surname}`, arrival: arrival, departure: departure, price: price};
        console.log('1 POST:', reservation);

        const client = new MongoClient('mongodb+srv://admin:admin@cluster0.szu7uaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        await client.connect();
        console.log('Connected successfully to server - POST');

        const db = client.db('HOTEL');
        const roomsDB = db.collection('rooms');
        const reservationsDB = db.collection('reservations');

        await roomsDB.updateOne(
            { number: number },
            { $push: { guests: `${name} ${surname}`} }
        )

        await reservationsDB.insertOne(reservation, (insertErr, result) => {
            if (insertErr) {
              console.error('Error inserting document:', insertErr);
              res.status(500).send('Server error');
            }            
        });
        client.close();
        res.json(reservation);
        console.log(reservation);
    } catch (err) {
        console.trace(err);
        console.error('Error handling POST request:', err);
        res.status(500).send('Server error');
    }
});

adminRouter.delete('/delete', async (req, res) => {
    console.log('POST');

    try {
        const client = new MongoClient('mongodb+srv://admin:admin@cluster0.szu7uaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        await client.connect();
        console.log('Connected successfully to server - DELETE');

        const db = client.db('HOTEL');
        const roomsDB = db.collection('rooms');
        const reservationsDB = db.collection('reservations');

        const roomIds = [1, 2, 3];

        await roomsDB.updateMany(
            { number: { $in: roomIds } },
            { $set: { guests: [] } },
            (updateErr, result) => {
              if (updateErr) {
                console.error('Error updating documents:', updateErr);
                res.status(500).send('Server error');
              }            
            }
        );
        await reservationsDB.deleteMany({}, (deleteErr, result) => {
            if (deleteErr) {
              console.error('Error deleting documents:', deleteErr);
            } else {
              console.log('Documents deleted successfully:', result.deletedCount);
            }
        });
        res.json('All data has been deleted');
        client.close();
    } catch (err) {
        console.trace(err);
        console.error('Error handling POST request:', err);
        res.status(500).send('Server error');
    }
});

adminRouter.post('/addroom', async (req, res) => {
    const body = req.body;
    console.log(body);

    const number = parseInt(body.number);
    const limit = parseInt(body.limit);
    const price = parseInt(body.price);
    
    if (body.number && body.limit && body.price) {
        const room = {number: number, limit: limit, price: price, guests: []};
        try {
            const client = new MongoClient('mongodb+srv://admin:admin@cluster0.szu7uaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
            await client.connect();
            console.log('Connected successfully to server - ADDROOM');

            const db = client.db('HOTEL');
            const roomsDB = db.collection('rooms');

            const result = await roomsDB.insertOne(room);
            console.log('Inserted document with _id:', result.insertedId);

            client.close();
        } catch (err) {
            console.trace(err);
            console.error('Error handling POST request:', err);
            res.status(500).send('Server error');
        }
    } else {
        console.log('Invalid data');
    }
});

app.use('/', guestRouter);
app.use('/admin', adminRouter);

app.get('*', (req, res) => {
    res.redirect('/src/hotel10.html');
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser'; 
import { MongoClient } from 'mongodb';

/* *************************** */
/* Configuring the application */
/* *************************** */
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', __dirname + '/views'); // Files with views can be found in the 'views' directory
app.set('view engine', 'pug'); // Use the 'Pug' template system
app.locals.pretty = app.get('env') === 'development'; // The resulting HTML code will be indented in the development environment


/* ************************************************ */

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public')); 

/* ******** */
/* "Routes" */
/* ******** */

app.get('/', async function (request, response) {
    const client = new MongoClient('mongodb+srv://admin:admin@cluster0.szu7uaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    await client.connect();

    const db = client.db('agh');
    const collection = db.collection('students');
    const student = await collection.find({}).toArray();

    response.render('index', { students: student }); // Render the 'index' view
    client.close();
});

app.get('/:wydzial', async (req, res) => {
    const wydzial = req.params.wydzial;

    try{
        const client = new MongoClient('mongodb+srv://admin:admin@cluster0.szu7uaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        await client.connect();
        const db = client.db('agh');
        const collection = db.collection('students');
        const studentsDB = await collection.find({ 'faculty': wydzial }).toArray();

        res.render('index', {students: studentsDB });

        client.close();
    } catch (error) {
        console.log(error);
    }
});

/* ************************************************ */

app.listen(8000, function () {
    console.log('The server was started on port 8000');
    console.log('To stop the server, press "CTRL + C"');
});          
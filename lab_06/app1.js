import express from 'express';
import morgan from 'morgan';
import { encodeXML } from 'entities';
const app = express();
app.set('view engine', 'pug');
app.locals.pretty = app.get('env') === 'development';
/* ************************************************ */
morgan.token('accept', function (req, res) { return req.headers['accept'] })
app.use(morgan(':method :url :status\tAccept: :accept'));
app.use(express.urlencoded({ extended: false }));
/* ************************************************ */
app.get('/', function (request, response) {
    response.render('index');
});
app.all('/submit', function (req, res) {    
    let name = ['GET','DELETE'].includes(req.method) ? req.query.name: req.body.name;
    console.log();
    console.log('--------------');
    console.count('Request');
    console.log('--------------');    
    console.group('\x1B[35mreq.query\x1B[0m');
    console.table(req.query);
    console.groupEnd();
    console.group('\x1B[35mreq.body\x1B[0m');
    console.table(req.body);
    console.groupEnd();
    console.group('\x1B[35mname\x1B[0m');
    console.log(name);
    console.groupEnd();
    console.log();
    
    // Return the greeting in the format preferred by the WWW client
    switch (req.accepts(['html', 'text', 'json', 'xml'])) {
        case 'json':
            // Send the JSON greeting
            res.type('application/json');
            res.json({ welcome: `Hello '${name}'` });
            console.log(`The server sent a \x1B[31mJSON\x1B[0m document to the browser for the request below`);
            break;
        case 'xml':
            // Send the XML greeting
            name = name !== undefined ? encodeXML(name) : '';
            res.type('application/xml');
            res.send(`<welcome>Hello '${name}'</welcome>`);
            console.log(`The server sent an \x1B[31mXML\x1B[0m document to the browser for the request below`);
            break;
        default:
            // Send the text plain greeting
            res.type('text/plain');
            res.send(`Hello '${name}'`);
            console.log(`The server sent a \x1B[31mplain text\x1B[0m document to the browser for the request below`);
    }
});
/* ************************************************ */
app.listen(8000, function () {
    console.log('The server was started on port 8000');
    console.log('To stop the server, press "CTRL + C"');
});
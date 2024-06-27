import express from 'express';
import morgan from 'morgan';
import { encodeXML } from 'entities';
import cors from 'cors';
const app1 = express();
const app2 = express();
app1.set('view engine', 'pug');
app1.locals.pretty = app1.get('env') === 'development';
/* ************************************************ */
app2.use(morgan('dev'));
app2.use(express.urlencoded({ extended: false }));
/* ************************************************ */
let allowedOrigins = ['http://localhost:8001'];
app2.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
/* ************************************************ */
app1.get('/', function (request, response) {
    response.render('index');
});
app2.all('/submit', function (req, res) {
    // Return the greeting in the format preferred by the WWW client
    let name = ['GET','DELETE'].includes(req.method) ? req.query.name: req.body.name;
    
    switch (req.accepts(['html', 'text', 'json', 'xml'])) {
        case 'json':
            // Send the JSON greeting
            res.type('application/json');
            res.json({ welcome: `Hello '${name}'` });
            console.log(`\x1B[32mThe server sent a JSON document to the browser using the '${req.method}' method\x1B[0m`);
            break;
        case 'xml':
            // Send the XML greeting
            name = name !== undefined ? encodeXML(name) : '';
            res.type('application/xml');
            res.send(`<welcome>Hello '${name}'</welcome>`);
            console.log(`\x1B[32mThe server sent an XML document to the browser using the '${req.method}' method\x1B[0m`);
            break;
        default:
            // Send the text plain greeting
            res.type('text/plain');
            res.send(`Hello '${name}'`);
            console.log(`\x1B[32mThe server sent a plain text to the browser using the '${req.method}' method\x1B[0m`);
    }
});
/* ************************************************ */
app2.listen(8000, function () {
    console.log('The server was started on port 8000');
    app1.listen(8001, function () {
        console.log('The server was started on port 8001');
        console.log('To stop the servers, press "CTRL + C"');
    });
});
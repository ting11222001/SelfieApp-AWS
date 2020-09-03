// have access, import to express
const express = require('express');

// to connect with nedb
const Datastore = require('nedb');

// call express as a huge function
const app = express();

// add port for my server to listen
// add a call back function to check if my server is listening
// app.listen(process.env.PORT || 3000, () => console.log('I am listening!'));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Starting server at ${port}`);
});

// allow express to render a static html page
// create and use a directory called 'public'
app.use(express.static('public'));

// protect my server from incoming data
app.use(express.json({limit: '1mb'}));

// start to make a database and it will sit at this folder
const database = new Datastore('database.db');
// load data from the last time when server ran, and below file will pop up here.
database.loadDatabase();
// try to insert some data
// database.insert({name: 'TIffany', status: '🌈' });
// database.insert({name: 'LiTing', status: '🏆 ' });


// set up a web application for client to send data to my server
// create a call back function "response" I can send things back to client
// "request" contains all the info that client will send to my server
app.post('/api', (request, response) => {
    console.log('I got a request!');
    const data = request.body;
    // add timestamp
    const timestamp = Date.now();
    data.timestamp = timestamp;
    // NeDB query: server inserts the client request with data variable into database
    database.insert(data);
    response.json(data);
});

// clear all past records
app.delete('/api/clear', (request, response) => {
    console.log('I got a request!');
    database.remove({ }, { multi: true }, function (err, numRemoved) {
        database.loadDatabase(function (err) {
          // allow database to reload: done! 
        });
        response.json({status: "success"});
    });
});

// add a get method with a call back function
app.get('/api', (request, response) => {
    // NeDB query: shows all data in database
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        };
        // server sends back all the data in the database to client
        response.json(data);
    });
});
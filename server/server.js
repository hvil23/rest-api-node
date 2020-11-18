// Import local library's
require ('./config/config.js');

// Import extern library's
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Declare express in app
const app = express();

// Declare middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// Use all routes
app.use(require('./routes/index.js'));


// DB Conection
mongoose.set('useNewUrlParser', true);

mongoose.connect( `${process.env.DBURL}`,{useUnifiedTopology: true,useCreateIndex: true},(err) => {
    if ( err ) throw err;
    console.log('Se ha conectado a MONGODB')
});


// Lounch server and listen in defined port
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});


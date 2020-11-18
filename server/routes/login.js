// Import extern library's
const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

// Import model DB
const Usuario = require('../models/usuarios');

// Declare express in app
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email:body.email},(err,usuarioDB) => {
        if (err){
            return  res.status(500).json({
                  ok: false,
                  err
              });
        }

        if ( !usuarioDB ){
            return  res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario o clave incorrecto'
                }
            });
        }

        if (!bcrypt.compareSync( body.password,usuarioDB.password)){
            return  res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario o clave incorrecto'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        },process.env.SEED_TOKEN,{ expiresIn: process.env.EXPIRED_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });


});


module.exports = app;
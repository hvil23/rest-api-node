const express = require('express');

const fs = require('fs');

const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');

const app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req,res) => {
    let tipo = req.params.tipo;

    let img = req.params.img;

    let tipos = ['usuarios','productos'];

    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);

    if ((tipos.indexOf(tipo) < 0)  || (!fs.existsSync(pathImagen))){
        let noImagePath = path.resolve(__dirname,'../assets/no-image.png');
        res.sendFile(noImagePath);
    }else{
        res.sendFile(pathImagen);
    }


});

module.exports = app;
// Import extern library's
const express = require('express');

// Declare express in app
const app = express();

app.use(require('./login'));
app.use(require('./usuarios'));
app.use(require('./categorias'));
app.use(require('./productos'));
app.use(require('./upload'));
app.use(require('./imagenes'));

module.exports = app;
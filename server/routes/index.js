// Import extern library's
const express = require('express');

// Declare express in app
const app = express();

app.use(require('./usuarios'));
app.use(require('./login'));

module.exports = app;
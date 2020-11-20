const fs = require('fs');

const client_id = fs.readFileSync(__dirname+'/clientid.key',{encoding:'utf8', flag:'r'});

process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

process.env.DB = process.env.DB || 'cafe';

process.env.EXPIRED_TOKEN = 60*60*24*30;

process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'seed-develop';

process.env.DBURL = process.env.NODE_ENV==='dev'?'mongodb://localhost:27017/cafe':process.env.DBURL;

process.env.CLIENT_ID = process.env.CLIENT_ID || client_id;


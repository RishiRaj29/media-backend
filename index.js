const express = require('express');
const routes = require('./routes');
const db = require('./db'); 
const app = express();
require('dotenv').config()
const morgan = require('morgan');
    

app.use(express.json());
app.use(morgan('combined'))
app.use('/api',routes);

app.listen(3000,()=>{
    console.log("listening on port 3000");
});

module.exports = app;

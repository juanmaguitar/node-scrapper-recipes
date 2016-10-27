var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var getJSON = require('get-json');
var jsesc = require('jsesc');
var path = require('path');
var cors = require('cors');

var food2fork = require('./routes/food2fork')
var edamam = require('./routes/edamam')

var app = express();

var apiKeyFood2Fork = process.env.FOOD2FORK_API_KEY;

var apiKeyEdamam = process.env.EDAMAM_API_KEY;
var appIdEdamam = process.env.EDAMAM_APP_ID;

var baseUrl = process.env.BASE_URL;
var port = process.env.PORT;

var publicFolder = path.join(__dirname, 'public');

app.use('/food2fork', food2fork)
app.use('/edamam', edamam)

app.use( express.static(publicFolder) );

app.listen(process.env.PORT || '8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
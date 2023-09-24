var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
//var seedrandom = require('seedrandom')

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Index Page: Success!')
});


var express = require('express');
var router = express.Router();
//var logger = require('../config/winston');
const fs = require("fs");


var currentDir = __dirname;
// Define an API route for viewing the logs
router.get('/', (req, res) => {
    fs.readFile(currentDir+ '/../logs/combined.log', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return;
        }
        
        res.type('text/plain').send(data)
    })
    
});
module.exports = router;
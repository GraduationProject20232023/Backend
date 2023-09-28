var express = require('express');
var router = express.Router();
var logger = require('../config/winston');
const fs = require("fs");

const options = {
    from: new Date() - (24 * 60 * 60 * 1000),
    until: new Date(),
    limit: 10,
    start: 0,
    order: 'asc',
    fields: ['message']
  };

var currentDir = __dirname;
// Define an API route for viewing the logs
router.get('/', (req, res) => {
    fs.readFile(currentDir+ '/../logs/combined.log', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return;
        }
        const lines = data.split('\n');
        fifty_lines = ''
        const startIndex = Math.max(lines.length - 50, 0);
        for (let i = startIndex; i < lines.length; i++) {
            fifty_lines += lines[i];
            //console.log(lines[i]);
        }

        res.type('text/plain').send(fifty_lines)
    })
    
});

module.exports = router;
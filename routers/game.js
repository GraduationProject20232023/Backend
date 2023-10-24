var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
const logger = require('../config/winston')
const multer = require("multer");

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../Backend/game_videos/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.orinalname}`);
        
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.orinalname);
        if (ext !== ".mp4") {
            return cb(res.status(400).end("only mp4 is allowed"), false);
        }
        cb(null, true);
    },
});

const upload = multer({storage: storage}).single("file");

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Community Index Page: Success!')
});

router.post("/uploadvideos", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.json({success: false, err});

        }
        return res.json({
            success: true,
            url: res.req.file.path,
            fileName: res.req.file.filename,
        })
    })
})

module.exports = router;
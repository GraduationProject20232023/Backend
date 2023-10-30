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
        on = file.originalname.toString('utf8');
        cb(null, `${Date.now()}_${on}`);
        
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
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
    res.send('Game Index Page: Success!')
});
 /**
 * @swagger
 * paths:
 *   /games/uploadvideos:
 *     post:
 *       summary: "게임 영상 서버에 전송"
 *       description: "사용자가 촬영한 게임 영상을 서버에 전송함"
 *       requestBody:
 *         required: True
 *         content:
 *           multipart/form-data:
 *             schema: 
 *               type: object
 *               properties:
 *                 file: 
 *                   type: string
 *                   format: binary
 *         description: 스웨거에서는 영문이름 파일만 정상작동함. 포스트맨은 한글이름 파일도 상관 없음. 
 *       tags: [Games]
 *       responses:
 *         "200":
 *            description: 요청 성공
 *            content: 
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    success:
 *                      type: boolean
 *                      example: true
 *                    url:
 *                      type: string 
 *                      example: "..\\Backend\\board_files\\1\\우주.mp4"
 *                    fileName:
 *                      type: string
 *                      example: "space.mp4"
 * 
 *         "400":
 *           description: 요청 실패
 *           content: 
 *             application/json:
 *               schema: 
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   err: 
 *                     type: err
 *         
 */
router.post("/uploadvideos", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({success: false, err});

        }
        return res.status(200).json({
            success: true,
            url: res.req.file.path,
            fileName: res.req.file.filename,
        })
    })
})

module.exports = router;
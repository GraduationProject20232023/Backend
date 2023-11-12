var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
const logger = require('../config/winston')
const multer = require("multer");
var fs = require('fs');

var filename = "./input_file/input_file.txt"

let writeContext = function(body) {
    return new Promise(resolve => {
        fs.appendFile(filename, '\n'+ body, function(err) {
            if(err) {
                return console.log(err)
            }
            else {
                console.log('file modified.')
                resolve("success")
            }
        })

        
    })
}

let writeTitle = function(title) {
    return new Promise(resolve => {
        fs.writeFile(filename, title, function(err) {
            if(err) {
                return console.log(err)
            }
            else {
                console.log('file saved.')
                resolve("success")
            }
        })

        
    })
}

let readText = function() {
    return new Promise(resolve => {
        fs.readFile(filename, 'utf8', function(err, data) {
            if (err) console.log(err) 
            console.log('OK: '+ filename);
            console.log(data)
            res.send(data)
        })
    })
}


/**
 * @swagger
 * paths:
 *   /boards/posts/write/{board_name}:
 *     post:
 *       summary: "게시글 작성하기"
 *       description: "새 게시글을 저장한다."
 *       parameters:
 *         - in: path
 *           name: board_name
 *           schema: 
 *             type: string
 *             example: free
 *           required: true
 *           description: 게시판 이름- free(자유)와 info(정보) 중 하나 입력
 *       requestBody:
 *         required: True
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title: 
 *                   type: string
 *                   example: 수화 너무 재밌지 않나용
 *                   description: 글 제목
 *                 body: 
 *                   type: string
 *                   example: 시작한지 하루밖에 안됐지만 너무 재밌어서 진작 시작할 걸 그랬어요~
 *                   description: 글 내용
 *                 hashtag:
 *                   type: string
 *                   example: 재미, 동아리
 *                   description: 없으면 안 보내도 됨.
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (새 게시글 저장 성공)
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "412": 
 *            description: 파라미터 입력 오류1 -> req.body.title과 req.body.body 입력 필요.
 *         "417": 
 *            description: 파라미터 입력 오류1-> board_name은 free와 info 중 하나로 입력해야 함
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.post('/posts/write/:board_name', function (req, res, next) {
    if (req.session.useremail) {
        writer = req.session.useremail
        if (req.params.board_name) {
            board = req.params.board_name  //free와 info 중 하나
            if (req.body.title && req.body.body) {
                
                title = req.body.title
                body = req.body.body
                context = title + body
                console.log("==============")
                //f = open('../input_file/input_file.txt', 'w')
                
                let makeFile = async function() {
                    let result1 = writeTitle(title)
                    if (await result1 == "success") {
                        let result2 = writeContext(body) 
                        if (await result2 == "success") {
                            // fs.readFile(filename, 'utf8', function(err, data) {
                            //     if (err) console.log(err) 
                            //     console.log('OK: '+ filename);
                            //     console.log(data)
                            //     res.send(data)
                            // })
                        }
                    }
                }
                
                (async () => {
                    let start = await makeFile()
                })

                
                if (req.body.hashtag) {
                    hashtag = req.body.hashtag
                }
                else {
                    hashtag = null
                }
                ins = [board, title, body, writer, hashtag]
                //tags = hashtag.split(',')
                
                // dbConnection.query('INSERT INTO posts (`board_name`, `title`, `body`, `user_email`, `hashtag`) VALUES (?, ?, ?, ?, ?)', ins, (error, rows) => {
                //     if (error) {
                //         res.status(500).send('DB Error: 로그 확인해주세요.'); 
                //         logger.log('error', error);
                //     }
                //     else {
                //         res.status(200).send('새 게시글 저장 성공!')
                //         logger.log('info', '새 게시글 저장 성공!')
                //     }
                // })
            }
            else {
                logger.log('error', '파라미터 오류')
                res.status(412).send('파라미터 입력 오류2: req.body.title과 req.body.body 입력 필요.')
            }
            
        }
        else {
            logger.log('error', '파라미터 오류')
            res.status(417).send('파라미터 입력 오류1: board_name은 free와 info 중 하나로 입력해야 함.')
        }
    }
    else {
        res.status(401).send( '로그인하지 않았음!')
        logger.log('error', '로그인하지 않았음!')
    }
});

module.exports = router;

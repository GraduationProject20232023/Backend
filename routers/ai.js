var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
const logger = require('../config/winston')
const multer = require("multer");
var fs = require('fs');


var filename = "./AI/NLP/input_text2.txt"



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



router.post('/posts/write', function (req, res, next) {
    if (req.session.useremail) {
        writer = req.session.useremail
        if (req.body.title && req.body.body) {
                
            title = req.body.title
            body = req.body.body
            context = title + body
            console.log("==============")
            //f = open('../input_file/input_file.txt', 'w')
            
            let makeFile = async function() {
                const { spawn } = require('child_process');
                const python = spawn('python', ['./AI/NLP/notice_board_test_code.py'])

                let result1 = writeTitle(title)
                if (await result1 == "success") {
                    let result2 = writeContext(body) 
                    if (await result2 == "success") {
                        if (req.body.hashtag) {
                            hashtag = req.body.hashtag
                        }
                        else {
                            hashtag = null
                        }


                        python.stdout.on('data', (data) => {
                            
                            let json = JSON.stringify(data)
                            let bufferOriginal = Buffer.from(JSON.parse(json).data);
                            let decision = bufferOriginal.toString().replace(/(\r\n|\n|\r)/gm, "")
                            console.log('bufferOriginal: '+ decision)
                            
                            if (decision == "Free Noticeboard") {
                                
                                board = 'free' 
 
                            }
                            else if (decision == "Information Noticeboard") {

                                board = 'info'
                            
                            }

                            ins = [board, title, body, writer, hashtag]

                                dbConnection.query('INSERT INTO posts (`board_name`, `title`, `body`, `user_email`, `hashtag`) VALUES (?, ?, ?, ?, ?)', ins, (error, rows) => {
                                    if (error) {
                                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                        logger.log('error', error);
                                    }
                                    else {
                                        res.status(200).send('새 게시글 저장 성공!')
                                        logger.log('info', '새 게시글 저장 성공!')
                                    }
                                })

                        })
                        
                    }
                }
            }
            
            (async () => {
                let start = await makeFile()
            })

            
            
            
            
            
        }
        else {
            logger.log('error', '파라미터 오류')
            res.status(412).send('파라미터 입력 오류2: req.body.title과 req.body.body 입력 필요.')
        }
    }
    else {
        res.status(401).send( '로그인하지 않았음!')
        logger.log('error', '로그인하지 않았음!')
    }
});

module.exports = router;

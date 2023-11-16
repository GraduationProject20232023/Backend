var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
const logger = require('../config/winston')
const multer = require("multer");
var fs = require('fs');
var path = require('path');

var filename = "./AI/NLP/input_text2.txt"



// let writeContext = function(body) {
//     return new Promise(resolve => {
//         fs.appendFile(filename, '\n'+ body, function(err) {
//             if(err) {
//                 return console.log(err)
//             }
//             else {
//                 console.log('file modified.')
//                 resolve("success")
//             }
//         })

        
//     })
// }

// let writeTitle = function(title) {
//     return new Promise(resolve => {
//         fs.writeFile(filename, title, function(err) {
//             if(err) {
//                 return console.log(err)
//             }
//             else {
//                 console.log('file saved.')
//                 resolve("success")
//             }
//         })

        
//     })
// }

// let readText = function() {
//     return new Promise(resolve => {
//         fs.readFile(filename, 'utf8', function(err, data) {
//             if (err) console.log(err) 
//             console.log('OK: '+ filename);
//             console.log(data)
//             res.send(data)
//         })
//     })
// }



// router.post('/posts/write', function (req, res, next) {
//     if (req.session.useremail) {
//         writer = req.session.useremail
//         if (req.body.title && req.body.body) {
                
//             title = req.body.title
//             body = req.body.body
//             context = title + body
//             console.log("==============")
//             //f = open('../input_file/input_file.txt', 'w')
            
//             let makeFile = async function() {
//                 const { spawn } = require('child_process');
//                 const python = spawn('python', ['./AI/NLP/notice_board_test_code.py'])

//                 let result1 = writeTitle(title)
//                 if (await result1 == "success") {
//                     let result2 = writeContext(body) 
//                     if (await result2 == "success") {
//                         if (req.body.hashtag) {
//                             hashtag = req.body.hashtag
//                         }
//                         else {
//                             hashtag = null
//                         }


//                         python.stdout.on('data', (data) => {
                            
//                             let json = JSON.stringify(data)
//                             let bufferOriginal = Buffer.from(JSON.parse(json).data);
//                             let decision = bufferOriginal.toString().replace(/(\r\n|\n|\r)/gm, "")
//                             console.log('bufferOriginal: '+ decision)
                            
//                             if (decision == "Free Noticeboard") {
                                
//                                 board = 'free' 
 
//                             }
//                             else if (decision == "Information Noticeboard") {

//                                 board = 'info'
                            
//                             }

//                             ins = [board, title, body, writer, hashtag]

//                                 dbConnection.query('INSERT INTO posts (`board_name`, `title`, `body`, `user_email`, `hashtag`) VALUES (?, ?, ?, ?, ?)', ins, (error, rows) => {
//                                     if (error) {
//                                         res.status(500).send('DB Error: 로그 확인해주세요.'); 
//                                         logger.log('error', error);
//                                     }
//                                     else {
//                                         res.status(200).send('새 게시글 저장 성공!')
//                                         logger.log('info', '새 게시글 저장 성공!')
//                                     }
//                                 })

//                         })
                        
//                     }
//                 }
//             }
            
//             (async () => {
//                 let start = await makeFile()
//             })

            
            
            
            
            
//         }
//         else {
//             logger.log('error', '파라미터 오류')
//             res.status(412).send('파라미터 입력 오류2: req.body.title과 req.body.body 입력 필요.')
//         }
//     }
//     else {
//         res.status(401).send( '로그인하지 않았음!')
//         logger.log('error', '로그인하지 않았음!')
//     }
// });


/**
 * @swagger
 * paths:
 *   /ai/uploadvideos:
 *     post:
 *       summary: "게임 동영상 전송하기"
 *       description: "사용자의 게임 동영상을 전송한다."
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
 *       tags: [Games]
 *       responses:
 *         "200":
 *            description: 요청 성공 (새 게시글 저장 성공)
 *            content: 
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    success:
 *                      type: bool
 *                      example: true
 *                    url: 
 *                      type: string
 *                      example: ..\\Backend\\game_videos\\2\\796.mp4
 *                      description: 서버 저장 경로
 *                    fileName: 
 *                      type: string
 *                      example: 796.mp4
 *                      description: 동영상 저장 이름
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "412": 
 *            description: 파라미터 입력 오류1 -> req.body.title과 req.body.body 입력 필요.
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.post("/uploadvideos", (req, res) => {

    if (req.body) {
        id_set = {}
    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            on = file.originalname.toString('utf8');
            file_name = on.split("_")
            
            game_id = file_name[0]
            id_set['game_id'] = game_id
            dir_path = '../Backend/game_videos/' + game_id
            if (! fs.existsSync(dir_path)) {
                try{
                    fs.mkdirSync(dir_path);
                }
                catch(e) {
                    res.status(402).send('폴더 생성 오류')
                }
                //console.log(dir_path, ' exists.')
            }
            

            cb(null, dir_path + "/");
        },
        filename: (req, file, cb) => {
            on = file.originalname.toString('utf8');
            // console.log('on: ', on)
            file_name = on.split("_")
            // console.log(file_name)
            game_id = file_name[0]
            word_id = file_name[1]
            id_set['word_id'] = word_id.replace('.mp4', '') 
            //cb(null, `${on}`);
            cb(null, word_id);
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
    
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({success: false, err});

        }
        else {
            file_set = {
                '경제생활': 'test_econ.py',
                '교육': 'test_edu.py', 
                '문화': 'test_culture.py',
                '사회생활': 'test_social.py', 
                '삶': 'test_life.py', 
                '식생활': 'test_food.py', 
                '의생활': 'test_clothes.py', 
                '인간': 'test_human.py', 
                '자연': 'test_nature.py', 
                '주생활': 'test_house.py'
            }

            const { spawn } = require('child_process');
            
            console.log(id_set)
            //console.log(id_set['game_id'])
            dbConnection.query('SELECT game_category FROM game_results WHERE game_id = ?', id_set['game_id'], (error, result) => {
                if (error ) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {
                    //console.log(result)
                    console.log(result[0]['game_category'])
                    
                    console.log(path.dirname(res.req.file.path))
                    fs.readdir(path.dirname(res.req.file.path), (err, files) => {
                        //console.log(files.length)
                        question_id = files.length
                        dbConnection.query('UPDATE game_results SET '+ question_id.toString() + '_ques = ? WHERE game_id = ?', [id_set['word_id'], game_id], (error, rows) => {
                            if (error) {
                                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                    logger.log('error', error);
                            }
                            else {
                                console.log('success')
                            }
                        })
                    })
                    
                    const python = spawn('python', ['./AI/test code/'+ file_set[result[0]['game_category']], [id_set['game_id']], [id_set['word_id']]])
                    
                    python.stdout.on('data', (data) => {
                        myValue= data.toString().replace('\r\n', '')
                        //console.log('pattern: ', data.toString());
                        console.log(data.toString().replace('\r\n', ''))
                        var isTrueSet = (myValue === 'true');
                        console.log(isTrueSet)
                        //console.log(data.toString().replace('\r\n', '')))
                        //final_result.push(data.toString())
                        if (isTrueSet) {
                            dbConnection.query('UPDATE game_results SET '+ question_id.toString() + '_res = ? WHERE game_id = ?', [isTrueSet, game_id], (error, rows) => {
                                if (error) {
                                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                        logger.log('error', error);
                                }
                                else {
                                    console.log('success')
                                }
                            })
                        }
                        
                    });

                    
                    python.stderr.on('data', (data) => {
                        //res.status(400).send(data.toString())
                        console.error('err: ', data.toString());
                      });
                      
                    python.on('error', (error) => {
                        //res.status(400).send(data.toString())
                    console.error('error: ', error.message);
                    });
                      
                    // python.on('close', (code) => {
                    // console.log('child process exited with code ', code);
                    // });
                }
            })
            return res.status(200).json({
                success: true,
                url: res.req.file.path,
                fileName: res.req.file.filename,
            })


           
        }
    })
    }
    else {
        res.status(400).send('did not upload files.')
    }
    //console.log(req.file)
    // const game_id = req.query.game_id
    // dir_path = '../Backend/game_videos/' + game_id
    // if (! fs.existsSync(dir_path)) {
    //     try{
    //         fs.mkdirSync(dir_path);
    //     }
    //     catch(e) {
    //         res.status(402).send('폴더 생성 오류')
    //     }
    //     //console.log(dir_path, ' exists.')
    // }
    
    //console.log('game_id: ', game_id)
    //console.log('question_id: ', question_id)
    
})




module.exports = router;

var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
const logger = require('../config/winston')
const multer = require("multer");
const fs = require("fs");



/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Game Index Page: Success!')
});

// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         on = file.originalname.toString('utf8');
//         console.log('on: ', on)
//         file_name = on.split("_")
//         game_id = file_name[0]
//         question_id = file_name[1]
//         dir_path = '../Backend/game_videos/' + game_id
//         if (! fs.existsSync(dir_path)) {
//             try{
//                 fs.mkdirSync(dir_path);
//             }
//             catch(e) {
//                 res.status(402).send('폴더 생성 오류')
//             }
            
//         }
//         cb(null, dir_path);
//     },
//     filename: (req, file, cb) => {
//         on = file.originalname.toString('utf8');
//         question_id = file_name[1]
//         cb(null, `${question_id}`);
//         //cb(null, question_id);
//     },
//     fileFilter: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         if (ext !== ".mp4") {
//             return cb(res.status(400).end("only mp4 is allowed"), false);
//         }
//         cb(null, true);
//     },
// });

    
// const upload = multer({storage: storage}).single("file");
//  /**
//  * @swagger
//  * paths:
//  *   /games/uploadvideos:
//  *     post:
//  *       summary: "게임 영상 서버에 전송"
//  *       description: "사용자가 촬영한 게임 영상을 서버에 전송함"
//  *       requestBody:
//  *         required: True
//  *         content:
//  *           multipart/form-data:
//  *             schema: 
//  *               type: object
//  *               properties:
//  *                 file: 
//  *                   type: string
//  *                   format: binary
//  *         description: 스웨거에서는 영문이름 파일만 정상작동함. 포스트맨은 한글이름 파일도 상관 없음. 
//  *       tags: [Games]
//  *       responses:
//  *         "200":
//  *            description: 요청 성공
//  *            content: 
//  *              application/json:
//  *                schema:
//  *                  type: object
//  *                  properties:
//  *                    success:
//  *                      type: boolean
//  *                      example: true
//  *                    url:
//  *                      type: string 
//  *                      example: "..\\Backend\\board_files\\1\\우주.mp4"
//  *                    fileName:
//  *                      type: string
//  *                      example: "space.mp4"
//  * 
//  *         "400":
//  *           description: 요청 실패
//  *           content: 
//  *             application/json:
//  *               schema: 
//  *                 type: object
//  *                 properties:
//  *                   success:
//  *                     type: boolean
//  *                     example: false
//  *                   err: 
//  *                     type: err
//  *         
//  */
// router.post("/uploadvideos", (req, res) => {
    
    
//     upload(req, res, (err) => {
//         if (err) {
//             return res.status(400).json({success: false, err});

//         }
//         else {
//             return res.status(200).json({
//                 success: true,
//                 url: res.req.file.path,
//                 fileName: res.req.file.filename,
//             })
//         }


        
//     })
// })

router.post("/uploadvideos", (req, res) => {
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
    
    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            on = file.originalname.toString('utf8');
            file_name = on.split("_")
            game_id = file_name[0]
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
            question_id = file_name[1]
            //cb(null, `${on}`);
            cb(null, question_id);
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
            

            return res.status(200).json({
                success: true,
                url: res.req.file.path,
                fileName: res.req.file.filename,
            })
        }


        
    })
})

 /**
 * @swagger
 * paths:
 *   /games/start:
 *     post:
 *       summary: "게임 시작"
 *       description: "게임 주제 입력받아서 게임 시작 "
 *       parameters:
 *         - in: path
 *           name: game_category
 *           schema:
 *             type: string
 *           required: true
 *           description: 게임 주제
 *       tags: [Games]
 *       responses:
 *         "200":
 *            description: 요청 성공
 *            content: 
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    game_id:
 *                      type: integer
 *                      example: 10
 *                      description: 게임 실행 id로 게임 기록 저장에 필요
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 *         "412":       
 *            description: 파라미터 오류. 정확한 파라미터 명과 개수 입력 필요
 *         
 */
router.post("/start/:game_category", function(req, res, next) {
    if (req.params.game_category) {
        game_category = req.params.game_category
        
        // 회원 사용자
        if (req.session.useremail) {
            player_email = req.session.useremail
            game_info = {}
            dbConnection.query('INSERT INTO game_results(`game_category`, `player_email`) VALUES (?,?)', [game_category, player_email], (error, result) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {

                    console.log(result)
                    dbConnection.query('SELECT LAST_INSERT_ID();', (error, result) => {
                        if (error) {
                            res.status(500).send('DB Error: 로그 확인해주세요.'); 
                        logger.log('error', error);
                        }
                        else {
                            dbConnection.query('SELECT * FROM game_results WHERE game_id = ? ;', result[0]["LAST_INSERT_ID()"], (error, result) => {
                                if (error) {
                                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                    logger.log('error', error);
                                }
                                else {
                                    res.status(200).send({'game_id': result[0]['game_id']})
                                    //res.send(result['game_id'])
                                }
                            })
                            
                        }
                    })
                }
            })
            
        }
        // 비회원 사용자
        else {
            game_info = {}
            dbConnection.query('INSERT INTO game_results(`game_category`) VALUES (?)', game_category, (error, result) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {
                    console.log(result)
                    dbConnection.query('SELECT LAST_INSERT_ID();', (error, result) => {
                        if (error) {
                            res.status(500).send('DB Error: 로그 확인해주세요.'); 
                        logger.log('error', error);
                        }
                        else {
                            dbConnection.query('SELECT * FROM game_results WHERE game_id = ? ;', result[0]["LAST_INSERT_ID()"], (error, result) => {
                                if (error) {
                                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                    logger.log('error', error);
                                }
                                else {
                                    res.status(200).send({'game_id': result[0]['game_id']})
                                    //res.send(result['game_id'])
                                }
                            })
                            
                        }
                    })
                }
            })
        }


    }
    else {
        logger.log('error', '파라미터 오류')
        //res.sendStatus(412)
        res.status(412).send('파라미터 입력 오류!')
    }
})
 /**
 * @swagger
 * paths:
 *   /games/game-records:
 *     post:
 *       summary: "게임 기록 확인"
 *       description: "게임 id 입력받아서 게임 기록 보여줌. "
 *       parameters:
 *         - in: path
 *           name: game_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: 게임 id
 *       tags: [Games]
 *       responses:
 *         "200":
 *            description: 요청 성공
 *            content: 
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    isSuccess:
 *                      type: bool
 *                      example: true
 *                    code:
 *                      type: integer
 *                      example: 1000
 *                    message: 
 *                      type: string
 *                      example: 성공
 *                    result: 
 *                      type: array
 *                      items: 
 *                        type: object
 *                        properties:
 *                          game_id: 
 *                            type: integer
 *                            example: 3
 *                          played_at:
 *                            type: string
 *                            description: 게임 실행 시작 시간
 *                          player_email:
 *                            type: string 
 *                            description: 없으면 null
 *                          questions:
 *                            type: array
 *                            items: 
 *                              type: string
 *                              example: '강'
 *                          quiz_results:
 *                            type: array
 *                            items: 
 *                              type: boolean
 *                          score: 
 *                            type: integer
 *                            example: 60 
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 *         "412":       
 *            description: 파라미터 오류. 정확한 파라미터 명과 개수 입력 필요
 *         
 */
router.get("/game-results/:game_id", function(req, res, next) { 
    if (req.params.game_id) {
        game_id = req.params.game_id
        console.log(game_id)
        result = {}
        dbConnection.query('SELECT * FROM game_results WHERE game_id =?',game_id, (error, rows) => {
            if (error) {
                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                logger.log('error', error);
            }
            else {
                if (! rows.length) {
                    final_result = {
                        "isSuccess": true,
                        "code": 1000,
                        "message": "성공", 
                        "result": []
                    }

                    res.status(200).send(final_result)
                }
                else {
                    final_result = {
                        "isSuccess": true,
                        "code": 1000,
                        "message": "성공", 
                        "result": []
                    }
                    result['game_id'] = game_id
                    result['played_at'] = rows[0]['played_at']
                    result['player_email'] = rows[0]['player_email']
                    result['game_category'] = rows[0]['game_catgory']
                    result['questions'] = []
                    result['quiz_results'] = []
                    // result['questions'].push(rows[0]['1_ques'])
                    // result['questions'].push(rows[0]['2_ques'])
                    // result['questions'].push(rows[0]['3_ques'])
                    // result['questions'].push(rows[0]['4_ques'])
                    // result['questions'].push(rows[0]['5_ques'])
                    // result['questions'].push(rows[0]['6_ques'])
                    // result['questions'].push(rows[0]['7_ques'])
                    // result['questions'].push(rows[0]['8_ques'])
                    // result['questions'].push(rows[0]['9_ques'])
                    // result['questions'].push(rows[0]['10_ques'])
                    result['quiz_results'].push(Boolean(rows[0]['1_res']))
                    result['quiz_results'].push(Boolean(rows[0]['2_res']))
                    result['quiz_results'].push(Boolean(rows[0]['3_res']))
                    result['quiz_results'].push(Boolean(rows[0]['4_res']))
                    result['quiz_results'].push(Boolean(rows[0]['5_res']))
                    result['quiz_results'].push(Boolean(rows[0]['6_res']))
                    result['quiz_results'].push(Boolean(rows[0]['7_res']))
                    result['quiz_results'].push(Boolean(rows[0]['8_res']))
                    result['quiz_results'].push(Boolean(rows[0]['9_res']))
                    result['quiz_results'].push(Boolean(rows[0]['10_res']))
                    final_result['score'] = 0
                    function getMeaning(id) {
                        return new Promise ( resolve => {
                            dbConnection.query('SELECT meaning FROM words WHERE id = ?',[word_id], (error, data) => {
                                if (error) {
                                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                    logger.log('error', error);
                                }
                                else {
                                    word_meaning = data[0]['meaning']
                                    //console.log(word_meaning)
                                    //console.log(result['quiz_results'])
                                    //result['questions'].push(word_meaning)
                                    resolve(word_meaning)
                                    
                                    
                                }
                            })
                        })
                    }
                    async function putMeanings() {
                        for (var i = 1; i <= 10; i++) {
                            word_id= rows[0][i.toString() + '_ques']
                            console.log(i)
                            if (word_id) {
                                word_meaning = await getMeaning(word_id)
                                result['questions'].push(word_meaning)
                                
                            }
                            else {
                                result['questions'].push(null)
                            }
                            if ( i == 10) {
                                final_result['result'].push(result)
                                res.status(200).send(final_result)
                            }
                            final_result['score'] += 10* (rows[0][i.toString()+'_res'])
                        }
                    }
                    
                    putMeanings()

                }
                
            }
        }
        )
    }
    else {
        logger.log('error', '파라미터 오류')
        //res.sendStatus(412)
        res.status(412).send('파라미터 입력 오류!')
    }
    }
)


module.exports = router;
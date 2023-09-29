var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
var logger = require('../config/winston');
//var seedrandom = require('seedrandom')

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Note Index Page: Success!')
});

/**
 * @swagger
 * paths:
 *   /notes/list:
 *     get:
 *       summary: "사용자의 단어장 목록 가져오기"
 *       description: "사용자의 단어장 목록을 보여준다."
 *       tags: [Notes]
 *       responses:
 *         "200":
 *            description: 요청 성공 (친구 목록 불러오기 성공)
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items: 
 *                    type: object
 *                    properties:
 *                      note_id: 
 *                        type: integer
 *                        example: 2
 *                      note_name: 
 *                        type: string
 *                        example: 1주차
 *                      created_at:
 *                        type: string
 *                        example: 2023-09-29 17:47:40
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "404": 
 *            description: 사용자의 단어장 목록이 비어있어서 빈 목록을 반환함.
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.get('/list', function(req, res, next) {

    if (req.session.useremail) {
        useremail = req.session.useremail
        dbConnection.query('SELECT * FROM notes WHERE user_email = ?; ', [useremail], (error, rows) => {
            result = []
            if (error) {
                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                logger.log('error', error);
            }
            if (!rows.length) { 
                //res.sendStatus(404)
                res.status(404).send('해당 사용자에 저장된 단어장 없음 (빈 목록)')
                //logger.log('error', '해당 사용자에 저장된 단어장 없음')
            }
            else {
                for (var data of rows) {
                    console.log(data['note_name']) 
                    
                    var item = {}
                    item['note_id'] = data['note_id']
                    item['note_name'] = data['note_name']
                    item['created_at'] = JSON.stringify(data['created_at']).replace(/"/, '').replace(/T/, ' ').replace(/\..+/, '')
                    result.push(item)
                    logger.log('info', JSON.stringify(result))
                    
                    //result.push(data['user2'])
                }
                res.status(200).send(result)
    
            }
        })
    }
    else {
        res.status(401).send('로그인 상태가 아님!')
        logger.log('error', '로그인하지 않았습니다.')
    }
 })


/**
 * @swagger
 * paths:
 *   /notes/{note_name}:
 *     get:
 *       summary: "단어장의 단어 목록 가져오기"
 *       description: "하나의 단어장의 단어 목록을 보여준다."
 *       parameters:
 *         - in: path
 *           name: note_name
 *           schema: 
 *             type: string
 *           required: true
 *           description: 단어장 이름
 *       tags: [Notes]
 *       responses:
 *         "200":
 *            description: 요청 성공 (단어장의 단어 id 목록 불러오기 성공)
 *            content: 
 *              applicaton/json:
 *                schema:
 *                  type: integer
 *                  example: [30, 105, 370]
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함
 *         "403": 
 *            description: 빈 단어장.
 *         "404": 
 *            description: 해당 단어장 이름으로 된 단어장은 사용자의 단어장 목록에 없음.
 *         "412": 
 *            description: 파라미터 입력 오류
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
 router.get('/:note_name', function(req, res, next) {

    if (req.session.useremail) {
        user_email = req.session.useremail
        if (req.params.note_name) {
            note_name = req.params.note_name
            ins = [user_email, note_name]

            dbConnection.query('SELECT * FROM notes WHERE user_email = ? AND note_name = ?; ', ins, (error, rows) => {
                result = []
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                if (! rows.length) {
                    res.status(404).send('해당 단어장 이름으로 된 단어장은 사용자의 단어장 목록에 없음.')
                }
                else {
                    //if (Array.isArray(rows) && !rows.length) { res.sendStatus(404)}
                    for (var data of rows) {
                    //console.log(data['note_name']) 
                    //console.log(data['note_id'])
                        result.push(data['note_id'])
                        logger.log('info', 'note_name: ' + data['note_name'])
                        logger.log('info', 'note_id: ' + data['note_id'])
                    //result.push(data['user2'])
                    }

                    dbConnection.query('SELECT * FROM note_words WHERE note_id = ? ;', result[0], (error, rows) => {
                        if (error) {
                            res.status(500).send('DB Error: 로그 확인해주세요.'); 
                            logger.log('error', error);
                        }
                        if (!rows.length) {
                            res.status(403).send('빈 단어장.')
                        }
                        else {
                            words = []
                            for (var data of rows) {
                                words.push(data['word_id'])
                            }
                            res.status(200).send(words)
                        }
                    })
                }
                
            })
        }
        else {
            logger.log('error', '파라미터 오류')
            //res.sendStatus(412)
            res.status(412).send('파라미터 입력 오류!')
        }
    }
    else {
        res.status(401).send('로그인 상태가 아님!')
        logger.log('error', '로그인하지 않았습니다.')
    }
 })


/**
 * @swagger
 * paths:
 *   /notes/add/{note_name}:
 *     post:
 *       summary: "단어장 추가"
 *       description: "단어장을 생성한다."
 *       parameters:
 *         - in: path
 *           name: note_name
 *           schema: 
 *             type: string
 *           required: true
 *           description: 새로 만들 단어장 이름
 *       tags: [Notes]
 *       responses:
 *         "200":
 *            description: 요청 성공 (단어장 추가 성공)
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "403": 
 *            description: 이미 같은 이름의 단어장이 존재함.
 *         "412":       
 *            description: 파라미터 입력 오류. 정확한 파라미터 명과 개수 입력 필요
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인
 *         
 *         
 * 
 */
router.post('/add/:note_name', function(req, res, next) {
    
    if (req.session.useremail) {
        user_email = req.session.useremail
        if (req.params.note_name) {
            note_name = req.params.note_name    
            ins = [user_email, note_name]
            //console.log(user_email)
            //console.log(note_name)
            dbConnection.query('SELECT * FROM notes WHERE user_email = ? AND note_name = ?; ', ins, (error, rows) => {
            //result = []
            if (error) {
                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                logger.log('error', error);
            }
            if (rows.length) {
                logger.log('error', '이미 같은 이름의 단어장이 존재함')
                res.status(403).send('이미 같은 이름의 단어장이 존재함')
            }
            else {
                dbConnection.query('INSERT INTO notes (`user_email`, `note_name`) VALUES (?, ?)', ins, (err, row) => {
                    if (err) {
                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                        logger.log('error', error);
                    }
                    else {
                        //console.log('Successfully inserted to friends')
                        logger.log('info', '단어장 생성 완료함')
                        logger.log('info', '입력정보: ' + ins)
                        res.status(200).send('단어장 생성 완료함! ' + ins)
                }
                })
            }

        })
        }
        else {
            logger.log('error', '파라미터 오류')
            //res.sendStatus(412)
            res.status(412).send('파라미터 입력 오류!')
        }
    }
    else {
        res.status(401).send('로그인하지 않았습니다.')
        logger.log('error', '로그인하지 않았습니다.')
    }
 })

 
/**
 * @swagger
 * paths:
 *   /notes/delete/{note_name}:
 *     post:
 *       summary: "단어장 삭제"
 *       description: "사용자의 단어장 목록에서 단어장을 삭제한다."
 *       parameters:
 *         - in: path
 *           name: note_name
 *           schema: 
 *             type: string
 *           required: true
 *           description: 단어장 이름
 *       tags: [Notes]
 *       responses:
 *         "200":
 *            description: 요청 성공 (단어장 삭제 성공)
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "404": 
 *            description: 해당 단어장 이름을 가진 단어장이 사용자의 단어장 목록에 존재하지 않음.
 *         "412": 
 *            description: 파라미터 입력 오류. 정확한 파라미터 명과 개수 입력 필요
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인
 *         
 *         
 * 
 */
router.post('/delete/:note_name', function (req, res, next) {
    if (req.session.useremail) {
        user_email = req.session.useremail
        if (req.params.note_name) {
            note_name = req.params.note_name
            ins = [user_email, note_name]
            dbConnection.query('SELECT * FROM notes WHERE user_email = ? AND note_name = ?; ', ins, (error, rows) => {
                
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {
                    if (! rows.length) {
                        res.status(404).send('해당 단어장 이름을 가진 단어장이 사용자의 단어장 목록에 존재하지 않음.')
                    }
                    else {
                        dbConnection.query('SET foreign_key_checks = 0;', (error) => {
                            if (error) {
                                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                logger.log('error', error);
                            }
                        }) 
                        dbConnection.query('DELETE FROM notes WHERE user_email = ? AND note_name = ?; ', ins, (error, rows) => {
                            if (error) {
                                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                logger.log('error', error);
                            } 
                            else {
                                res.status(200).send('단어장 삭제 성공!')
                                //logger.log('info', '단어장 삭제 성공')
                            }
                        })
                        dbConnection.query('SET foreign_key_checks = 1;', (error) => {
                            if (error) {
                                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                logger.log('error', error);
                            }
                        })
                    }
                }
            })
        }
        else {
            logger.log('error', '파라미터 오류')
            res.status(412).send('파라미터 입력 오류!')
        }

    }
    else {
        res.status(401).send('로그인한 상태가 아님!')
        logger.log('error', '로그인하지 않았음')
    }
})



/**
 * @swagger
 * paths:
 *   /notes/words/add/{note_name}/{word_id}:
 *     post:
 *       summary: "단어장에 단어 추가"
 *       description: "단어 id로 단어장에 단어를 추가한다."
 *       parameters:
 *         - in: path
 *           name: note_name
 *           schema: 
 *             type: string
 *           required: true
 *           description: 단어장 이름
 *         - in: path
 *           name: word_id
 *           schema: 
 *             type: integer
 *           required: true
 *           description: 추가할 단어의 id
 *       tags: [Notes]
 *       responses:
 *         "200":
 *            description: 요청 성공 (단어장에 단어 추가 성공)
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "403": 
 *            description: 이 단어장에 이미 저장된 단어.
 *         "404": 
 *            description: 해당 단어장 이름을 가진 단어장이 사용자의 단어장 목록에 존재하지 않음
 *         "412":       
 *            description: 파라미터 입력 오류. 정확한 파라미터 명과 개수 입력 필요
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인
 *         
 *         
 * 
 */
router.post('/words/add/:note_name/:word_id', function (req, res, next) {
    if (req.session.useremail) {
        user_email = req.session.useremail
        if (req.params.note_name && req.params.word_id) {
            note_name = req.params.note_name
            word_id = req.params.word_id
        
            ins = [user_email, note_name]

            dbConnection.query('SELECT * FROM notes WHERE user_email = ? AND note_name = ?; ', ins, (error, rows) => {
                
                if (error)  {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                if (! rows.length) {
                    res.status(404).send('해당 단어장 이름을 가진 단어장이 사용자의 단어장 목록에 존재하지 않음.')
                }
                else {
                    result = []
                    //if (Array.isArray(rows) && !rows.length) { res.sendStatus(404)}
                    for (var data of rows) {
                    //console.log(data['note_name']) 
                    //console.log(data['note_id'])
                        result.push(data['note_id'])
                        logger.log('info', 'note_name: ' + data['note_name'])
                        logger.log('info', 'note_id: ' + data['note_id'])
                        //result.push(data['user2'])
                    }
                    note_id = result[0]

                    dbConnection.query('SELECT * FROM note_words where note_id = ? AND word_id = ?', [note_id, word_id], (error, rows2) => {
                        if (error)  {
                            res.status(500).send('DB Error: 로그 확인해주세요.'); 
                            logger.log('error', error);
                        }
                        if (rows2.length) {
                            res.status(403).send('이 단어장에 이미 저장된 단어입니다.')
                        }
                        else {
                            dbConnection.query('INSERT INTO note_words (`note_id`, `word_id`) VALUES (?, ?)', [note_id, word_id], (err, row) => {
                                if (error) {
                                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                    logger.log('error', error);
                                }
                                else {
                                    res.status(200).send('단어장에 새 단어 저장 성공!')
                                    logger.log('info', '단어장에 새 단어 저장 성공!')
                             }
                            
                            })
                        }
                    })
                }
            })
        }
        else {
            logger.log('error', '파라미터 오류')
            //res.sendStatus(412)
            res.status(412).send('파라미터 입력 오류!')
        }
    }
    else {
        res.status(401).send('로그인 상태가 아님!')
        logger.log('error', '로그인하지 않았습니다.')
    }
})
/**
 * @swagger
 * paths:
 *   /notes/words/delete/{note_name}/{word_id}:
 *     post:
 *       summary: "단어장에서 단어 삭제"
 *       description: "단어id로 단어장에서 단어를 삭제한다."
 *       parameters:
 *         - in: path
 *           name: note_name
 *           schema: 
 *             type: string
 *           required: true
 *           description: 단어장 이름
 *         - in: path
 *           name: word_id
 *           schema: 
 *             type: integer
 *           required: true
 *           description: 삭제할 단어의 id
 *       tags: [Notes]
 *       responses:
 *         "200":
 *            description: 요청 성공 (단어 삭제 성공)
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "404": 
 *            description: 해당 단어장 이름을 가진 단어장이 사용자의 단어장 목록에 존재하지 않음.
 *         "403": 
 *            description: 해당 단어는 단어장에 없는 단어임.
 *         "412": 
 *            description: 파라미터 입력 오류. 정확한 파라미터 명과 개수 입력 필요
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인
 *         
 *         
 * 
 */
router.post('/words/delete/:note_name/:word_id', function(req, res, next) {
    if (req.session.useremail) {

        user_email = req.session.useremail
        if (req.params.note_name && req.params.word_id) {
            note_name = req.params.note_name
            word_id = req.params.word_id
        
            ins = [user_email, note_name]

            dbConnection.query('SELECT * FROM notes WHERE user_email = ? AND note_name = ?; ', ins, (error, rows) => {
                
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {
                    if (! rows.length) {
                        res.status(404).send('해당 단어장 이름을 가진 단어장이 사용자의 단어장 목록에 존재하지 않음.')
                    }
                    else {
                        result = []
                        for (var data of rows) {
                            //console.log(data['note_name']) 
                            //console.log(data['note_id'])
                            result.push(data['note_id'])
                            logger.log('info', 'note_name: ' + data['note_name'])
                            logger.log('info', 'note_id: ' + data['note_id'])
                            //result.push(data['user2'])
                        }
                        note_id = result[0]
                        dbConnection.query('SELECT * FROM note_words WHERE note_id = ? AND word_id = ?;', [note_id, word_id], (error, rows) => {
                            if (error) {
                                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                logger.log('error', error);
                            }
                            else {
                                if (!rows.length) {
                                    res.status(403).send('해당 단어는 단어장에 없는 단어임.')
                                }
                                else {
                                    dbConnection.query('DELETE FROM note_words WHERE note_id = ? AND word_id = ?; ', [note_id, word_id], (error, row) => {
                                        if (error) {
                                            res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                            logger.log('error', error);
                                        }
                                        else {
                                            res.status(200).send('단어장에서 해당 단어 삭제 성공!')
                                            logger.log('info', '단어장에서 단어 삭제 성공!')
                                        }
                                        
                                    })
                                }
                            }
                        })
                        

                    }
                } 

            })
        }
        else {
            logger.log('error', '파라미터 오류')
            res.status(412).send('파라미터 입력 오류!')
        }
    }
    else {
        res.status(401).send('로그인 상태가 아님!')
        logger.log('error', '로그인하지 않았습니다.')
    }
})





module.exports = router;

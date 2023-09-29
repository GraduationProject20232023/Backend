var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
const logger = require('../config/winston')
//var seedrandom = require('seedrandom')

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Friend Index Page: Success!')
});

//친구 추가
/**
 * @swagger
 * paths:
 *   /friends/add:
 *     post:
 *       summary: "친구 추가"
 *       description: "닉네임으로 친구를 추가한다."
 *       reqeustBody:
 *         required: True
 *         content: 
 *           application/json:
 *           schema:
 *             type: object
 *             properties:
 *               friend: 
 *                 type: string
 *                 example: 루이
 *                 description: 추가할 친구의 닉네임 입력
 *       tags: [Friends]
 *       responses:
 *         "200":
 *            description: 요청 성공 (친구 추가 성공)
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "403": 
 *            description: 이미 친구 목록에 등록된 친구.
 *         "404": 
 *            description: 입력된 닉네임을 가진 사용자가 존재하지 않음.
 *         "412":       
 *            description: 파라미터 입력 오류. 정확한 파라미터 명과 개수 입력 필요
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인
 *         
 *         
 * 
 */
router.post('/add', function(req, res, next) {
    
    if (req.session.useremail) {
        if (req.body.friend) {
            const friend = req.body.friend


            user_email = req.session.useremail
            dbConnection.query('SELECT * FROM users WHERE username = ?; ', [friend], (error, rows) => {
                result = []
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }

                if (!rows.length) {
                    res.status(404).send('입력된 닉네임을 가진 사용자가 존재하지 않음.')
                }
                else {
                    for (var data of rows) { 
                        result.push(data['user_email'])
                    }
                    friend_email = result[0]
                    ins = [user_email, friend_email]
                    dbConnection.query('SELECT * FROM friends where user_email = ? AND friend_email = ?', ins, (error, row) => {
                        if (error) {
                            res.status(500).send('DB Error: 로그 확인해주세요.'); 
                            logger.log('error', error);
                        }
                        else {
                            if (row.length) {
                                //이미 친구 등록 되어 있는 경우
                                res.status(403).send('이미 등록된 친구입니다.')
                            }
                            else {
                                dbConnection.query('INSERT INTO friends (`user_email`, `friend_email`) VALUES (?, ?)', ins, (error, row) => {
                                    if (error) {
                                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                        logger.log('error', error);
                                    }
                                    else {
                                        reverse_ins = [friend_email, user_email]
                                        dbConnection.query('INSERT INTO friends (`user_email`, `friend_email`) VALUES (?, ?)', reverse_ins, (error, row) => {
                                            if (error) {
                                                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                                logger.log('error', error);
                                            }
                                            else {
                                                res.status(200).send('서로 친구 목록에 친구 추가 성공!')
                                                logger.log('info', '서로를 친구로 추가 성공!')
                                                //console.log('Successfully inserted to friends')
                                            }
                                        })
                                    }
                                })
                            }
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
        logger.log('error', '로그인 상태가 아님.')
    }
 })


//친구 삭제
/**
 * @swagger
 * paths:
 *   /friends/delete:
 *     post:
 *       summary: "친구 삭제"
 *       description: "닉네임으로 친구 목록에서 친구를 삭제한다."
 *       reqeustBody:
 *         required: True
 *         content: 
 *           application/json:
 *           schema:
 *             type: object
 *             properties:
 *               friend: 
 *                 type: string
 *                 example: 루이
 *                 description: 삭제할 친구의 닉네임 입력
 *       tags: [Friends]
 *       responses:
 *         "200":
 *            description: 요청 성공 (친구 삭제 성공)
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "404": 
 *            description: 입력된 닉네임을 가진 사용자가 존재하지 않음.
 *         "403": 
 *            description: 해당 닉네임은 사용자의 친구 목록에 없는 사용자임.
 *         "412": 
 *            description: 파라미터 입력 오류. 정확한 파라미터 명과 개수 입력 필요
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인
 *         
 *         
 * 
 */
router.post('/delete', function(req, res, next) {
    
    if (req.session.useremail) {
        if (req.body.friend) {
            console.log(req.body)
            const friend = req.body.friend
            user_email = req.session.useremail

            dbConnection.query('SELECT * FROM users WHERE username = ?; ', [friend], (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                result = []
                if (!rows.length) {
                    res.status(404).send('입력된 닉네임을 가진 사용자가 존재하지 않음.')
                }
                else {
                    for (var data of rows) { 
                        result.push(data['user_email'])
                    }
                    friend_email = result[0]
                    ins = [user_email, friend_email]
                    dbConnection.query('SELECT * FROM friends where user_email = ? AND friend_email = ?', ins, (error, row) => {
                        if (error) {
                            res.status(500).send('DB Error: 로그 확인해주세요.'); 
                            logger.log('error', error);
                        }
                        else {
                            if (!row.length) {
                                //이미 친구 등록 되어 있는 경우
                                res.status(403).send('해당 닉네임은 사용자의 친구 목록에 없는 사용자임.')
                            }
                            else {
                                dbConnection.query('DELETE FROM friends WHERE user_email = ? AND friend_email = ? ', ins, (error, row) => {
                                    if (error) {
                                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                        logger.log('error', error);
                                    }
                                    else {
                                        reverse_ins = [friend_email, user_email]
                                        dbConnection.query('DELETE FROM friends WHERE user_email = ? AND friend_email = ? ', reverse_ins, (error, row) => {
                                            if (error) {
                                                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                                logger.log('error', error);
                                            }
                                            else {
                                                res.status(200).send('서로 친구 목록에서 삭제 성공!')
                                                logger.log('info', '서로 친구 목록에서 삭제 성공!')
                                            }
                                        })
                                    }
                                })
                            }
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
        logger.log('error', '로그인 상태가 아님.')
    }
 })

//친구 목록
/**
 * @swagger
 * paths:
 *   /friends/list:
 *     get:
 *       summary: "친구 목록 가져오기"
 *       description: "사용자의 친구 목록(닉네임 목록)을 보여준다."
 *       tags: [Friends]
 *       responses:
 *         "200":
 *            description: 요청 성공 (친구 목록 불러오기 성공)
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "404": 
 *            description: 사용자의 친구 목록이 비어있어서 빈 목록을 반환함.
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.get('/list', function(req, res, next) {

    if (req.session.useremail) {
        useremail = req.session.useremail
        dbConnection.query('SELECT * FROM friends WHERE user_email = ?; ', [useremail], (error, rows) => {
            result = []
            if (error) {
                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                logger.log('error', error);
            }
            //console.log(rows)
            logger.log('info', '사용자의 친구 목록 -> ' + rows)
            //console.log(rows.length)
            //console.log(!rows.length)
            if (!rows.length) { 
                res.status(404).send('사용자의 친구 목록은 빈 목록임.')
            }
            else {
                for (var data of rows) {
                    //console.log(data['friend_email']) 
                    friend_email = data['friend_email']
                    dbConnection.query('SELECT * FROM users WHERE user_email = ?; ', [friend_email], (error, rows) => {
                        if (error) {
                            res.status(500).send('DB Error: 로그 확인해주세요.'); 
                            logger.log('error', error);
                        }
                        for (var item of rows) {
                            console.log(item)
                            result.push(item['username'])
                            res.status(200).send(result)
                        }
                    })
                }
            }
        })
    }
    else {
        res.status(401).send('로그인 상태가 아님!')
    }
 })
//친구의 단어장 접근

module.exports = router;

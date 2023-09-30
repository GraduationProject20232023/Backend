var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
const logger = require('../config/winston')
const bcrypt = require('bcrypt');
const saltRounds = 10;
router.get('/', function(req, res, next) {
    res.send('My Page Index Page: Success!')
});
/**
 * @swagger
 * paths:
 *   /mypage/user-info/{password}:
 *     get:
 *       summary: "사용자 정보 가져오기"
 *       description: "사용자의 정보(이메일, 닉네임, 계정 생성 시간)을 보여준다."
 *       parameters:
 *         - in: path
 *           name: password
 *           schema: 
 *             type: string
 *           required: true
 *           description: 계정 비밀번호
 *       tags: [Mypage]
 *       responses:
 *         "200":
 *            description: 요청 성공 (사용자 정보 불러오기 성공)
 *            content: 
 *              applicaton/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    user_email:
 *                      type: string
 *                      example: mjluckk@gmail.com
 *                    user_name:
 *                      type: string
 *                      example: 루이
 *                    created_at:
 *                      type: string
 *                      example: 2023-09-12 11:17:51
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함
 *         "403": 
 *            description: 비밀번호가 틀림.
 *         "412": 
 *            description: 파라미터 입력 오류
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.get('/user-info/:password', function(req, res, next) {
    if (req.session.useremail) {
        user_email = req.session.useremail
        if (req.params.password) {
            password = req.params.password
        
            dbConnection.query('SELECT * FROM users WHERE user_email = ?', user_email, (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {
                    for (var data of rows) {
                        authentic_hashed_password = data['password_']
                        const verified = bcrypt.compareSync(password, authentic_hashed_password)
                        if (verified) {
                            item = {}
                            item['user_email'] = data['user_email']
                            item['user_name'] = data['username']
                            item['created_at'] = JSON.stringify(data['created_at']).replace(/"/, '').replace(/T/, ' ').replace(/\..+/, '')
                            // "\"2023-09-29T11:55:33.000Z\""
                            res.status(200).send(item)
                        }
                        else {
                            res.status(403).send('비밀번호가 틀림.')
                        }
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
        logger.log('error', '로그인 상태가 아님.')
    }
});

/**
 * @swagger
 * paths:
 *   /mypage/posts:
 *     get:
 *       summary: "사용자가 작성한 게시글 목록 가져오기"
 *       description: "사용자가 작성한 게시글 목록(게시글 번호, 게시판 이름, 글 제목, 조회수, 생성 시간)을 보여준다."
 *       tags: [Mypage]
 *       responses:
 *         "200":
 *            description: 요청 성공 (사용자의 게시글 목록 불러오기 성공)
 *            content: 
 *              applicaton/json:
 *                schema:
 *                  type: array
 *                  items: 
 *                    type: object
 *                    properties:
 *                      post_id:
 *                        type: integer
 *                        example: 1
 *                      board_name:
 *                        type: string
 *                        example: free
 *                      title:
 *                        type: string
 *                        example: 첫 게시글 제목이에욤
 *                      views:
 *                        type: integer
 *                        example: 6 
 *                      created_at:
 *                        type: string
 *                        example: 2023-09-12 11:17:51
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함
 *         "403": 
 *            description: 작성한 글이 없음.
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.get('/posts', function(req, res, next) {
    if (req.session.useremail) {
        writer = req.session.useremail

        dbConnection.query('SELECT * FROM posts WHERE user_email = ?', writer, (error, rows) => {
            if (error) {
                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                logger.log('error', 'DB 오류: sections 테이블에서 섹션 검색하는 것에 실패함. MySQL 에러 => ' + error);
            }
            else {
                if (! rows.length) {
                    res.status(403).send('작성한 글이 없음.')
                }
                else {
                    result = []
                    for (var data of rows) {
                        item = {}
                        item['post_id'] = data['post_id']
                        item['board_name'] = data['board_name']
                        item['title'] = data['title']
                        item['views'] = data['views']
                        item['created_at'] =  JSON.stringify(data['created_at']).replace(/"/, '').replace(/T/, ' ').replace(/\..+/, '')

                        result.push(item)
                    }
                    res.status(200).send(result)

                }
            }
        })
    }
    else {
        res.status(401).send('로그인 상태가 아님!')
        logger.log('error', '로그인 상태가 아님')
    }
});

router.get('/game-records', function (req, res, next) {

});
/**
 * @swagger
 * paths:
 *   /mypage/user-info/nickname/change:
 *     post:
 *       summary: "닉네임 수정"
 *       description: "사용자의 닉네임을 수정한다."
 *       requestBody:
 *         required: True
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 password: 
 *                   type: string
 *                   example: fndl
 *                   description: 개인정보 보호용으로 닉네임 변경 전 비밀번호를 입력받음.
 *                 newnickname: 
 *                   type: string
 *                   example: 루이2
 *                   description: 해당 string으로 사용자의 닉네임이 수정된다. 
 *       tags: [Mypage]
 *       responses:
 *         "200":
 *            description: 요청 성공 (닉네임 수정 성공)
 *         "400":
 *            description: 기존 닉네임과 같은 값을 입력하여 수정할 수 없음. 새로운 닉네임을 입력해야 함.
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "403": 
 *            description: 비밀번호가 틀림.
 *         "406":
 *            description: 이미 존재하는 닉네임. 다른 닉네임으로 수정할 수 있음.
 *         "412": 
 *            description: 파라미터 입력 오류. 정확한 파라미터 명과 개수 입력 필요
 *         "500": 
 *            description: 내부 오류 (DB오류 또는 Bcrypt오류) -> 자세한 오류 내용은 로그 확인
 *         
 *         
 * 
 */
router.post('/user-info/nickname/change', function(req, res, next) {
    if (req.session.useremail) {
        user_email = req.session.useremail
        if (req.body.password && req.body.newnickname) {
            password = req.body.password
            new_nickname = req.body.newnickname
            
            dbConnection.query('SELECT * FROM users WHERE user_email = ?', user_email, (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {
                    for (var data of rows) {
                        old_nickname = data['username'] 
                        if (new_nickname == old_nickname) {
                            res.status(400).send('기존 닉네임과 같은 값을 입력하여 수정할 수 없음. 새로운 닉네임을 입력해야 함.')
                        }
                        else {
                            authentic_hashed_password = data['password_']
                            const verified = bcrypt.compareSync(password, authentic_hashed_password)
                            if (verified) {
                                dbConnection.query('SELECT * FROM users WHERE username = ?', new_nickname, (error, rows) => {
                                    if (error) {
                                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                        logger.log('error', error);
                                    }
                                    else {
                                        if (rows.length) {
                                            res.status(406).send('이미 존재하는 닉네임. 다른 닉네임으로 수정할 수 있음.')
                                        }
                                        else {
                                            console.log(new_nickname)
                                            dbConnection.query('UPDATE users SET username = ? WHERE user_email = ? ', [new_nickname, user_email], (error, rows) => {
                                                if (error) {
                                                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                                    logger.log('error', error);
                                                }
                                                else {
                                                    res.status(200).send('성공적으로 닉네임을 수정함!')
                                                    logger.log('info', '성공적으로 닉네임을 수정함!')
                                                }
                                            }) 
                                        }
                                    }
                                })
                            }
                            else {
                                res.status(403).send('비밀번호가 틀림.')
                            }
                        }
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
        logger.log('error', '로그인 상태가 아님.')
    }
});
/**
 * @swagger
 * paths:
 *   /mypage/user-info/password/change:
 *     post:
 *       summary: "비밀번호 수정"
 *       description: "사용자의 비밀번호를 수정한다."
 *       requestBody:
 *         required: True
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 password: 
 *                   type: string
 *                   example: fndl
 *                   description: 개인정보 보호용 닉네임 변경 전 비밀번호를 입력받음.
 *                 newpassword: 
 *                   type: string
 *                   example: fndl2
 *                   description: 해당 string으로 사용자의 비밀번호가 수정된다. 
 *       tags: [Mypage]
 *       responses:
 *         "200":
 *            description: 요청 성공 (닉네임 수정 성공)
 *         "400":
 *            description: 기존 비밀번호와 같은 값을 입력하여 수정할 수 없음. 새로운 비밀번호를 입력해야 함.
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "403": 
 *            description: 비밀번호가 틀림.
 *         "412": 
 *            description: 파라미터 입력 오류. 정확한 파라미터 명과 개수 입력 필요
 *         "500": 
 *            description: 내부 오류 (DB오류 또는 Bcrypt오류) -> 자세한 오류 내용은 로그 확인
 */
router.post('/user-info/password/change', function(req, res, next) {
    if (req.session.useremail) {
        user_email = req.session.useremail
        if (req.body.password && req.body.newpassword) {
            password = req.body.password
            new_password = req.body.newpassword
            if (password == new_password) {
                res.status(400).send('기존 비밀번호와 같은 값을 입력하여 수정할 수 없음. 새로운 비밀번호를 입력해야 함.')
            }
            else {
                dbConnection.query('SELECT * FROM users WHERE user_email = ?', user_email, (error, rows) => {
                    if (error) {
                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                        logger.log('error', error);
                    }
                    else {
                        for (var data of rows) {
                            authentic_hashed_password = data['password_']
                            const verified = bcrypt.compareSync(password, authentic_hashed_password)
                            if (verified) {
                            
                                bcrypt.hash(new_password, saltRounds, (error, hash) => {
                                    if (error) {
                                        res.status(500).send('brypt error: 로그 확인해주세요.')
                                        logger.log('error', error)
                                    }
                                    new_hashed = hash
                                    dbConnection.query('UPDATE users SET password_ = ? WHERE user_email = ? ', [new_hashed, user_email], (error, rows) => {
                                        if (error) {
                                            res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                            logger.log('error', error);
                                        }
                                        else {
                                            res.status(200).send('성공적으로 비밀번호를 수정함!')
                                            logger.log('info', '성공적으로 비밀번호를 수정함!')
                                        }
                                    })
                                })
                            }
                            else {
                                res.status(403).send('비밀번호가 틀림.')
                            }
                        }
                    }
                })
            }
        }
        else {
            logger.log('error', '파라미터 오류')
            res.status(412).send('파라미터 입력 오류!')
        }  
    }
    else {
        res.status(401).send('로그인 상태가 아님!')
        logger.log('error', '로그인 상태가 아님.')
    }
});




module.exports = router;
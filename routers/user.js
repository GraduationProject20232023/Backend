dbConnection = require('../config/database.js');
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
var logger = require('../config/winston');

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('User Index Page: Success!')
    //console.log(req.session.cookie)
    logger.log('info', 'sessioncookie 정보: '+ req.session.cookie)
    //console.log(req.session.user)
    logger.log('info', 'session user 정보: ' + req.session.user)
});


/**
 * @swagger
 * paths:
 *   /users/register:
 *     post:
 *       summary: "회원 가입"
 *       description: "회원 가입 API"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 email:
 *                   type: string
 *                   example: mjluckk2@gmail.com
 *                 pw:
 *                   type: string
 *                   example: fndl
 *                 username: 
 *                   type: string
 *                   example: 루이
 *       tags: [Users]
 *       responses:
 *         "201":
 *            description: 가입 성공
 *         "400":
 *            description: 동일한 사용자 이름 존재. 다른 사용자 이름 입력해야 함
 *         "403":
 *            description: 동일한 이메일 계정 있습니다. 다른 이메일 시도해주세요         
 *         "412":       
 *            description: 파라미터 오류. 정확한 파라미터 명과 개수 입력 필요
 *         "500":       
 *            description: 내부 서버 오류. DB오류이거나 brypt 해시 오류-> 자세한 오류 내용을 로그 확인

*/
// Register
router.post('/register', (req, res, next) => {
    //console.log(req.body)
    logger.log('info', 'req.body: '+ JSON.stringify(req.body))
    if (req.body.email && req.body.pw && req.body.username) {
        const param = [req.body.email, req.body.pw, req.body.username]
    
        dbConnection.query("SELECT * FROM users WHERE user_email ='"+param[0]+ "';", (err, rows) => {
            if (err) {
                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                logger.log('error', err);
            }
            else if (rows.length == 0) { //같은 eamil이 없는 경우
                dbConnection.query("SELECT * FROM users WHERE username = '"+param[2]+"';", (err, rows) => {
                    if (err) {
                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                        logger.log('error', err);
                    }
                    if (rows.length == 0) { // 같은 username 없는 경우
                        bcrypt.hash(param[1], saltRounds, (error, hash) => {

                            if (error) {
                                res.status(500).send('brypt error: 로그 확인해주세요.')
                                logger.log('error', error)
                            }

                            param[1] = hash

                            dbConnection.query('INSERT INTO users(`user_email`, `password_`, `username`) VALUES (?, ?, ?)', param, (err, row) => {
                                if(err) {
                                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                    logger.log('error', err);
                                }
                                else {
                                    ins = [req.body.email, "default"]
                                    dbConnection.query('INSERT INTO notes (`user_email`, `note_name`) VALUES (?, ?)', ins, (err, row) => {
                                        if (err) {
                                            res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                            logger.log('error', error);
                                        }
                                        else {
                                            //console.log('Successfully inserted to friends')
                                            logger.log('info', '단어장 생성 완료함')
                                            logger.log('info', '입력정보: ' + ins)
                                            //res.status(200).send('단어장 생성 완료함! ' + ins)
                                            return res.status(201).send('Successfully created the account.') // 계정 생성함
                                        }
                                    })
                                    //return res.status(201).send('Successfully created the account.') // 계정 생성함
                                    
                                }
                            }

                            )
                        })
                    }
                    else { //같은 username 있는 경우
                        res.status(400).send('This username already exists.') ;
                        logger.log('error', '같은 username이 이미 존재합니다.')
                        
                    }
                });
            }
            else {
                //이미 같은 email 사용자 존재함
                res.status(403).send('This email already exists.')
                logger.log('error', '같은 email이 이미 존재합니다.')
            }
        });
    }
    else {
        logger.log('error', '파라미터 오류')
        //res.sendStatus(412)
        res.status(412).send('파라미터 입력 오류!')
    }
    //res.end()
})
/**
 * @swagger
 * paths:
 *   /users/login:
 *     post:
 *       summary: "로그인"
 *       description: "로그인 API"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 email:
 *                   type: string
 *                   example: mjluckk2@gmail.com
 *                 pw:
 *                   type: string
 *                   example: fndl
 *       tags: [Users]
 *       responses:
 *         "200":
 *            description: 로그인 성공
 *         "401":
 *            description: 비밀번호 틀림
 *         "402":
 *            description: 해당 email 계정이 존재하지 않습니다.
 *         "405": 
 *            description: 이미 로그인 되어있음.          
 *         "412":       
 *            description: 파라미터 오류. 정확한 파라미터 명과 개수 입력 필요
 *         "500":       
 *            description: 내부 서버 오류. DB오류이거나 brypt 해시, req.session 오류-> 자세한 오류 내용을 로그 확인

*/
// Login
router.post("/login", (req, res) => {
    //console.log("로그인 함수 실행")
    logger.log('info', '로그인 함수 실행')
    if (req.body.email && req.body.pw) {
        const param = [req.body.email, req.body.pw]

        if (req.session.useremail) {
            //if the session is ongoing, destroy the session
            // req.session.destroy(error => {
            //     if(error) {
            //     res.status(500).send('req.session.destroy error: 로그 확인해주세요.')
            //     logger.log('error', error)
            // }
            // else {
            //     res.status(405).send('이미 로그인 되어있음.')
            // }
            
            // })
            res.status(405).send('이미 로그인 되어있음.')
        }
        else {
            dbConnection.query('SELECT * FROM users WHERE user_email = ?', param[0], (err, row) => {
                if(err)  logger.log('error', err)
                console.log(row)
                if(row.length >0) {
                    bcrypt.compare(param[1], row[0].password_, (error, result) => {
                        if (error) {
                            res.status(500).send('brypt error: 로그 확인해주세요.')
                            logger.log('error', error)
                        }
                        if (result) { // 성공
                            //console.log('로그인 성공')
                            logger.log('info', '로그인 성공')
                            useremail = row[0]['user_email']
                            username = row[0]['username']
                            req.session.useremail = useremail
                            req.session.username = username
                            //logger.log('info', JSON.stringify(req.session.cookie))
                            //console.log(req.session.cookie)
                            req.session.save(error => {
                                if(error) {
                                    res.status(500).send('req.session.save error: 로그 확인해주세요.')
                                    logger.log('error', error)
                                }
                            })
                            logger.log('info', req.session.useremail + ' / ' + req.session.username + ' 로그인 완료!')
                            //console.log(req.session.sessionID)
                            res.cookie('user_email', useremail)
                            res.status(200).send(req.cookies)
                            //res.status(200).send({"cookie": req.session.cookie, "username": req.session.username})
                        }
                        else { // 실패
                            logger.log('error', '비밀번호 실패')
                            //console.log('비밀번호 실패')
                            res.status(401).send('비밀번호 입력 실패!')
                        }
                    }) 
                }
                else {
                    //console.log('email이 존재하지 않습니다. ')
                    logger.log('error', 'email이 존재하지 않습니다. ')
                    res.status(402).send('email이 존재하지 않습니다!')
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
 *   /users/logout:
 *     post:
 *       summary: "로그아웃"
 *       description: "로그아웃 API"
 *       tags: [Users]
 *       responses:
 *         "200":
 *            description: 로그아웃 성공
 *         "400":
 *            description: 로그아웃 실패
 *         "500":       
 *            description: 내부 서버 오류. req.session.destroy 오류-> 자세한 오류 내용을 로그 확인
 */
 // Logout
 router.post('/logout', (req, res)=> {
     if (req.session.useremail){ //세션 정보가 있을 때) 
        req.session.destroy(error => {
            if(error) {
                res.status(500).send('req.session.destroy error: 로그 확인해주세요.')
                logger.log('error', error)
            }
        })
        //console.log('로그아웃 성공')
        logger.log('info', '로그아웃 성공')
        res.status(200).send('로그아웃 성공!')
     }
     else {
        //console.log('로그아웃 실패')
        logger.log('error', '로그아웃 실패')
        res.status(400).send('로그아웃 실패')
     }
 })

module.exports = router;
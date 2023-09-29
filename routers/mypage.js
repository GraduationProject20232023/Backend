var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
const logger = require('../config/winston')
const bcrypt = require('bcrypt');

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

router.post('/user-info/nickname/change/:nickname', function(req, res, next) {

});

router.post('/user-info/password/change/:password', function(req, res, next) {

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


module.exports = router;
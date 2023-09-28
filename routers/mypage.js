var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
const logger = require('../config/winston')
const bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
    res.send('My Page Index Page: Success!')
});

router.get('/user-info', function(req, res, next) {
    if (req.session.useremail) {
        user_email = req.session.useremail
        password = req.body.password

        dbConnection.query('SELECT * FROM users WHERE user_email = ?', user_email, (error, rows) => {
            if (error) logger.log('error', 'DB 에러: users(사용자) 테이블에서 user_email로 사용자 정보 가져오기 실패함. MySQL 에러 => '+ error)

            else {
                for (var data of rows) {
                    authentic_hashed_password = data['password_']
                    const verified = bcrypt.compareSync(password, authentic_hashed_password)
                    if (verified) {
                        item = {}
                        item['user_email'] = data['user_email']
                        item['user_name'] = data['username']
                        item['created_at'] = data['created_at']
                        res.status(200).send(item)
                    }
                }
            }
        })        
    }
    else {
        res.sendStatus(401)
        logger.log('error', '로그인 상태가 아님')
    }
});

router.post('/user-info/nickname/change/:nickname', function(req, res, next) {

});

router.post('/user-info/password/change/:password', function(req, res, next) {

});

router.get('/posts', function(req, res, next) {
    if (req.session.useremail) {
        writer = req.session.useremail

        dbConnection.query('SELECT * FROM posts WHERE user_email = ?', writer, (error, rows) => {
            if (error) logger.log('error', 'DB 에러: posts(게시글) 테이블에서 게시글 목록 보여주기 실패함. MySQL 에러 => ' + error) 
            else {
                result = []
                for (var data of rows) {
                    item = {}
                    item['post_id'] = data['post_id']
                    item['board_name'] = data['board_name']
                    item['title'] = data['title']
                    item['views'] = data['views']
                    item['created_at'] = data['created_at']
                    result.push(item)
                }

                res.status(200).send(result)
            }
        })
    }
    else {
        res.status(401).send('You are not logged in!')
        logger.log('error', '로그인 상태가 아님')
    }
});

router.get('/game-records', function (req, res, next) {

});


module.exports = router;
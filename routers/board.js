var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
const logger = require('../config/winston')
//var seedrandom = require('seedrandom')

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Community Index Page: Success!')
});
//제일 조회수 많은 top3
router.get('/hot3/both', function (req, res, next) {

});
//제일 조회수 많은 top3 -자유게
router.get('/hot3/free', function (req, res, next) {

});
//제일 조회수 많은 top3 -정보게
router.get('/hot3/info', function (req, res, next) {

});
// 작성된 시간 역순으로 리스트 보여주기 -자유게
router.get('/free', function (req, res, next) {

});
// 작성된 시간 역순으로 리스트 보여주기 -정보게
router.get('/info', function (req, res, next) {

});

router.get('/article/:article_id', function (req, res, next) {
    post_id = req.params.article_id
    
    dbConnection.query('SELECT * FROM posts WHERE post_id = ?', post_id, (error, rows) => {
        if (error) logger.log('error', 'DB 오류: article_id(게시글 번호)로 posts(게시글) 테이블에서 게시글 가져오기 실패함. MySQL 에러 내용 => ' + error) 
        
        else {
            for (var data of rows) {
                
                var user_email = data['user_email']
                result = {}
                dbConnection.query('SELECT * FROM users WHERE user_email = ?', user_email, (error, rows) => {
                    if (error) logger.log('error', 'DB 에러: users(사용자)테이블에서 user_email로 user_name 가져오기 실패함. MySQL 에러 내용 => ' + error) 
                    else {
                        for (var data2 of rows) {
                            result['writer'] = data2['username']
                        }
                    }
                })
                result['post_id'] = data['post_id']
                result['board_name'] = data['board_name']
                result['title'] = data['title']
                result['body'] = data['body']
                result['views'] = data['views']
                result['created_at'] = data['created_at']
                
                res.status(200).send(result)
                logger.log('info', 'article_id로 게시글 불러오기 성공!')

                dbConnection.query('UPDATE posts SET views = views + 1 WHERE post_id = ?', data['post_id'], (error, rows) => {
                    if (error) logger.log('error', 'DB 에러: posts(게시글) 테이블에서 조회수 1 더하기 실패함. MySQL 에러 내용  => ' + error)
                    else {
                        
                        logger.log('info', '게시글 조회수 +1 성공!')
                        

                    }
                })
            }
            
        }
    })
});

router.post('/article/write/:board_name', function (req, res, next) {
    if (req.session.useremail) {
        
        board = req.params.board_name  //free와 info 중 하나
        title = req.body.title
        body = req.body.body
        writer = req.session.useremail
        ins = [board, title, body, writer]

        dbConnection.query('INSERT INTO posts (`board_name`, `title`, `body`, `user_email`) VALUES (?, ?, ?, ?)', ins, (error, rows) => {
            if (error) logger.log('error', 'DB 오류: posts(게시글) 테이블에 새 게시글 저장 실패함. MySQL 에러 내용 => ' + error) 
            else {
                res.status(201).send('Successfully created the post!')
                logger.log('info', '새 게시글 저장 성공!')
            }
        })

    }
    else {
        res.sendStatus(401)
        logger.log('error', '로그인하지 않았음!')
    }
});

router.post('/article/delete/:article_id', function (req, res, next) {
    if (req.session.useremail) {
        post_id = req.params.article_id
        writer = req.session.useremail
        
        ins = [post_id, writer]
        dbConnection.query('SELECT * FROM posts WHERE post_id = ?', post_id, (error, rows) => {
            if (error) logger.log('error', 'DB 에러: posts(게시글)에서 게시글 정보 확인에 실패함. MySQL 에러 내용 =>' + error) 
            else {
                for (var data of rows) {
                    if (writer == data['user_email']) {
                        dbConnection.query('DELETE FROM posts WHERE post_id = ? AND user_email = ?', ins, (error, rows) => {
                            if (error) logger.log('error', 'DB 에러: posts(게시글)에서 게시글 삭제 실패함. MySQL 에러 내용 => ' + error) 
                            else {
                                res.status(200).send('Successfully deleted the post!')
                                logger.log('info', '성공적으로 게시글을 삭제함!')
                            }
                        })
                    }
                    else {
                        res.status(403).send('You did not write this!')
                        logger.log('error', '해당 사용자가 작성한 게시글이 아님.')
                    }
                }
            }
        })
    }
    else {
        res.status(401).send('You are not logged in!')
        logger.log('error', '로그인하지 않았음!')
    }
});

router.post('/article/revise/:article_id', function (req, res, next) {
    if (req.session.useremail) {
        post_id = req.params.article_id
        writer = req.session.useremail
        new_title = req.body.title
        new_body = req.body.body
        console.log(new_title, new_body)
        ins = [new_title, new_body, post_id]
        console.log(ins)
        dbConnection.query('SELECT * FROM posts WHERE post_id = ?', post_id, (error, rows) => {
            if (error) logger.log('error', 'DB 에러: posts(게시글)에서 게시글 정보 확인에 실패함. MySQL 에러 내용 =>' + error) 
            else {
                for (var data of rows) {
                    if (writer == data['user_email']) {
                        dbConnection.query('UPDATE posts SET title = ?,s body = ? WHERE post_id = ?', ins, (error, rows) => {
                            if (error) logger.log('error', 'DB 에러: posts(게시글)에서 게시글 삭제 실패함. MySQL 에러 내용 => ' + error) 
                            else {
                                res.status(200).send('Successfully updated the post!')
                                logger.log('info', '성공적으로 게시글을 수정함!')
                            }
                        })
                    }
                    else {
                        res.status(403).send('You did not write this!')
                        logger.log('error', '해당 사용자가 작성한 게시글이 아님.')
                    }
                }
            }
        })
    }
    else {
        res.status(401).send('You are not logged in!')
        logger.log('error', '로그인하지 않았음!')
    }
});

router.post('/comment/write/:article_id', function (req, res, next) {

});

router.post('/comment/delete/:article_id/:comment_id', function (req, res, next) {

});

router.post('/comment/revise/:article_id/:comment_id', function (req, res, next) {

});

module.exports = router;

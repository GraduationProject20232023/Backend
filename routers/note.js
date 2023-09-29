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
 *       summary: "친구 목록 가져오가"
 *       description: "사용자의 친구 목록(닉네임 목록)을 보여준다."
 *       parameters:
 *         - in: path
 *           name: username
 *           schema: 
 *             type: string
 *           required: true
 *           description: 사용자의 username
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
        dbConnection.query('SELECT * FROM notes WHERE user_email = ?; ', [useremail], (error, rows) => {
            result = []
            if (error) throw logger.log('error', 'DB 에러: notes 테이블에서 user_email로 note 불러오기 실패함. MYSQL 에러 내용 => ' + error);
            if (Array.isArray(rows) && !rows.length) { 
                res.sendStatus(404) 
                logger.log('error', '해당 사용자에 저장된 단어장 없음')
            }
            else {
                for (var data of rows) {
                    console.log(data['note_name']) 
                    
                    var item = {}
                    item['note_id'] = data['note_id']
                    item['note_name'] = data['note_name']
                    item['created_at'] = data['created_at']
                    result.push(item)
                    logger.log('info', JSON.stringify(result))
                    
                    //result.push(data['user2'])
                }
                res.status(200).send(result)
    
            }
        })
    }
    else {
        res.sendStatus(401)
        logger.log('error', '로그인하지 않았습니다.')
    }
 })

 router.get('/:note_name', function(req, res, next) {

    if (req.session.useremail) {
        note_name = req.params.note_name
        user_email = req.session.useremail
        ins = [user_email, note_name]
        
        dbConnection.query('SELECT * FROM notes WHERE user_email = ? AND note_name = ?; ', ins, (error, rows) => {
            result = []
            if (error) logger.log('error', 'DB 에러: notes 테이블에서 user_email과 note_name으로 note 불러오기 실패함. MYSQL 에러 내용 => ' + error)
            //if (Array.isArray(rows) && !rows.length) { res.sendStatus(404)}
            for (var data of rows) {
                //console.log(data['note_name']) 
                //console.log(data['note_id'])
                result.push(data['note_id'])
                logger.log('info', 'note_name: ' + data['note_name'])
                logger.log('info', 'note_id: ' + data['note_id'])
                //result.push(data['user2'])
            }
            word_list = []
            dbConnection.query('SELECT * FROM note_words WHERE note_id = ? ;', result[0], (error, rows) => {
                if (error) logger.log('error', 'DB 에러: notes_words 테이블에서 note_id로 note_words 불러오기 실패함. MySQL 에러 내용 => ' + error)
                words = []
                for (var data of rows) {
                    words.push(data['word_id'])
                }

                if (! words.length) logger.log('warn', '빈 단어장')
                res.status(200).send(words)
            })
        })
    }
    else {
        res.sendStatus(401)
        logger.log('error', '로그인하지 않았습니다.')
    }
 })

router.post('/words/add/:note_name/:word_id', function (req, res, next) {
    if (req.session.useremail) {
        user_email = req.session.useremail
        note_name = req.params.note_name
        word_id = req.params.word_id
        
        ins = [user_email, note_name]
        
        dbConnection.query('SELECT * FROM notes WHERE user_email = ? AND note_name = ?; ', ins, (error, rows) => {
            result = []
            if (error) logger.log('error', 'DB 에러: notes 테이블에서 user_email과 note_name으로 note 불러오기 실패함. MYSQL 에러 내용 => ' + error)
            //if (Array.isArray(rows) && !rows.length) { res.sendStatus(404)}
            for (var data of rows) {
                //console.log(data['note_name']) 
                //console.log(data['note_id'])
                result.push(data['note_id'])
                logger.log('info', 'note_name: ' + data['note_name'])
                logger.log('info', 'note_id: ' + data['note_id'])
                //result.push(data['user2'])
            }
            
            dbConnection.query('INSERT INTO note_words (`note_id`, `word_id`) VALUES (?, ?)', [result[0], word_id], (err, row) => {
                if (error) logger.log('error', 'DB 에러: notes_words(단어장) 테이블에 note_id와 word_id로 새 단어 저장 실패함. MySQL 에러 내용 => ' + error)
                else {
                    res.sendStatus(200)

                    logger.log('info', '단어장에 새 단어 저장 성공!')
                }
                
            })
        })
    }
    else {
        res.sendStatus(401)
        logger.log('error', '로그인하지 않았습니다.')
    }
})

router.post('/words/delete/:note_name/:word_id', function(req, res, next) {
    if (req.session.useremail) {
        user_email = req.session.useremail
        note_name = req.params.note_name
        word_id = req.params.word_id
        
        ins = [user_email, note_name]
        
        dbConnection.query('SELECT * FROM notes WHERE user_email = ? AND note_name = ?; ', ins, (error, rows) => {
            result = []
            if (error) logger.log('error', 'DB 에러: notes 테이블에서 user_email과 note_name으로 note 불러오기 실패함. MYSQL 에러 내용 => ' + error)
            //if (Array.isArray(rows) && !rows.length) { res.sendStatus(404)}
            for (var data of rows) {
                //console.log(data['note_name']) 
                //console.log(data['note_id'])
                result.push(data['note_id'])
                logger.log('info', 'note_name: ' + data['note_name'])
                logger.log('info', 'note_id: ' + data['note_id'])
                //result.push(data['user2'])
            }
            
            dbConnection.query('DELETE FROM note_words WHERE note_id = ? AND word_id = ?; ', [result[0], word_id], (err, row) => {
                if (error) logger.log('error', 'DB 에러: notes_words(단어장) 테이블에서 note_id와 word_id로 단어 삭제 실패함. MySQL 에러 내용 => ' + error)
                else {
                    res.sendStatus(200)

                    logger.log('info', '단어장에서 단어 삭제 성공!')
                }
                
            })
        })
    }
    else {
        res.sendStatus(401)
        logger.log('error', '로그인하지 않았습니다.')
    }
})
router.post('/delete/:note_name', function (req, res, next) {
    if (req.session.useremail) {
        user_email = req.session.useremail
        note_name = req.params.note_name
        ins = [user_email, note_name]
        dbConnection.query('SET foreign_key_checks = 0;')
        dbConnection.query('DELETE FROM notes WHERE user_email = ? AND note_name = ?; ', ins, (error, rows) => {
            if (error) logger.log('error', 'DB 에러: notes 테이블에서 user_email과 note_name으로 notes를 삭제하지 못함. MySQL 에러 내용 => '+ error)
            else {
                res.sendStatus(200)
                logger.log('info', '단어장 삭제 성공')
            }
        })
        dbConnection.query('SET foreign_key_checks = 1;')
    }
    else {
        res.sendStatus(401)
        logger.log('error', '로그인하지 않았음')
    }
})

router.get('/add/:note_name', function(req, res, next) {
    
    if (req.session.useremail) {

        note_name = req.params.note_name
        user_email = req.session.useremail
        ins = [user_email, note_name]
        console.log(user_email)
        console.log(note_name)
        dbConnection.query('SELECT * FROM notes WHERE user_email = ? AND note_name = ?; ', ins, (error, rows) => {
            //result = []
            if (error) logger.log('error', error)
            if (rows.length) {
                logger.log('error', '이미 같은 이름의 단어장이 존재함')
                res.sendStatus(401)
            }
            else {
                dbConnection.query('INSERT INTO notes (`user_email`, `note_name`) VALUES (?, ?)', ins, (err, row) => {
                    if (err) logger.log('error', err)
                    else {
                        //console.log('Successfully inserted to friends')
                        logger.log('info', '단어장 생성 완료함')
                        logger.log('info', '입력정보: ' + ins)
                        res.status(200).send(ins)
                }
                })
            }
            
            
            
        })

    }
    else {
        res.sendStatus(401)
        logger.log('error', '로그인하지 않았습니다.')
    }
 })


module.exports = router;

var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
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
 *   /friends/new:
 *     get:
 *       summary: "GET 검색 기록"
 *       description: "사용자 이름으로 사전 검색 기록을 가져온다. (먼저 검색한 것 부터)"
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
 *            description: 요청 성공
 *            content: 
 *              application/json:
 *                schema:
 *                  type: array
 *                  example: ['안녕', '하늘']
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 * 
 * 
 */
router.get('/add', function(req, res, next) {
    
    if (req.session.useremail) {

        console.log(req.body)
        const friend = req.body.friend


        useremail = req.session.useremail
        dbConnection.query('SELECT * FROM users WHERE username = ?; ', [friend], (error, rows) => {
            result = []
            if (error) throw error;
            if (rows) {
                for (var data of rows) { 
                    result.push(data['user_email'])
                }
            } 
            ins = [useremail, result[0]]
            dbConnection.query('INSERT INTO friends (`user1`, `user2`) VALUES (?, ?)', ins, (err, row) => {
                if (err) console.log(err)
                else {
                    console.log('Successfully inserted to friends')
            }
            })
            res.status(200).send(result)
        })

    }
    else {
        res.sendStatus(401)
    }
 })
//친구 삭제
router.get('/delete', function(req, res, next) {
    
    if (req.session.useremail) {

        console.log(req.body)
        const friend = req.body.friend


        useremail = req.session.useremail
        dbConnection.query('SELECT * FROM users WHERE username = ?; ', [friend], (error, rows) => {
            result = []
            if (error) throw error;
            if (rows) {
                for (var data of rows) { 
                    result.push(data['user_email'])
                }
            } 
            ins = [useremail, result[0]]
            dbConnection.query('DELETE FROM friends WHERE user1 = ? AND user2 = ?; ', ins, (err, row) => {
                if (err) console.log(err)
                else {
                    console.log('Successfully deleted from friends')
            }
            })
            res.status(200).send(result)
        })

    }
    else {
        res.sendStatus(401)
    }
 })

//친구 목록
/**
 * @swagger
 * paths:
 *   /friends/list/{username}:
 *     get:
 *       summary: "GET 검색 기록"
 *       description: "사용자 이름으로 사전 검색 기록을 가져온다. (먼저 검색한 것 부터)"
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
 *            description: 요청 성공
 *            content: 
 *              application/json:
 *                schema:
 *                  type: array
 *                  example: ['안녕', '하늘']
 * 
 * 
 */
router.get('/list', function(req, res, next) {

    if (req.session.useremail) {
        useremail = req.session.useremail
        dbConnection.query('SELECT * FROM friends WHERE user1 = ?; ', [useremail], (error, rows) => {
            result = []
            if (error) throw error;
            if (Array.isArray(rows) && !rows.length) { res.sendStatus(404)}
            for (var data of rows) {
                console.log(data['user2']) 
                friend_email = data['user2']
                dbConnection.query('SELECT * FROM users WHERE user_email = ?; ', [friend_email], (error, rows) => {
                    if (error) throw error;
                    for (var item of rows) {
                        console.log(item)
                        result.push(item['username'])
                        res.status(200).send(result)
                    }
                })
                //result.push(data['user2'])
            }
            
        })
    }
    else {
        res.sendStatus(401)
    }
 })
//친구의 단어장 접근

module.exports = router;

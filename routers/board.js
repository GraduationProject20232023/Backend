var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
const logger = require('../config/winston')
const multer = require("multer");
const fs = require('fs');
const path = require("path");
//const { title } = require('process');
//var seedrandom = require('seedrandom')

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Community Index Page: Success!')
});
//제일 조회수 많은 top3
/**
 * @swagger
 * paths:
 *   /boards/hot3/both:
 *     get:
 *       summary: "가장 조회수가 많은 게시글의 목록을 보여준다."
 *       description: "가장 조회수가 많은 게시글의 게시판 제목, 게시글 제목, 조회수, 댓글수를 보여준다."
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (게시글 목록 불러오기 성공)
 *            content: 
 *              application/json: 
 *                schema: 
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties: 
 *                      board_name: 
 *                        type: string
 *                        example: info
 *                      post_id: 
 *                        type: integer
 *                        example: 4
 *                      title: 
 *                        type: string
 *                        example: 2023년 수화 시험 일정
 *                      body: 
 *                        type: string
 *                        example: 3월 5일 예정
 *                      views: 
 *                        type: integer
 *                        example: 7
 *                      comments: 
 *                        type: integer
 *                        example: 4
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.get('/hot3/both', function (req, res, next) {
    dbConnection.query('SELECT * FROM posts ORDER BY views DESC LIMIT 3', (error, rows) => {
        if (error) {
            res.status(500).send('DB Error: 로그 확인해주세요.'); 
            logger.log('error', error);
        }
        else {
            if (!rows.length) {
                final_result = {
                    "isSuccess": true,
                    "code": 1000,
                    "message": "성공", 
                    "result": []
                }
                
                
                res.status(200).send(final_result)
                //res.status(404).send('게시글이 존재하지 않음.')
            }
            else {
                result = []
                for (var data of rows) {
                    item = {}
                    item['boar_name'] = data['board_name']
                    item['post_id'] = data['post_id']
                    item['title'] = data['title']
                    item['body'] = data['body']
                    item['views'] = data['views']
                    //item['comments'] = data['comments']
                    result.push(item)
                }

                res.status(200).send(result)
            }
            //console.log(rows)
        }
    })
});
//제일 조회수 많은 top3 -자유게
/**
 * @swagger
 * paths:
 *   /boards/hot3/free:
 *     get:
 *       summary: "자유게시판에서 가장 조회수가 많은 게시글의 목록을 보여준다."
 *       description: "자유게시판에서 가장 조회수가 많은 게시글의 게시판 제목, 게시글 제목, 조회수, 댓글수를 보여준다."
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (게시글 목록 불러오기 성공)
 *            content: 
 *              application/json: 
 *                schema: 
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties: 
 *                      board_name: 
 *                        type: string
 *                        example: free
 *                      post_id: 
 *                        type: integer
 *                        example: 4
 *                      title: 
 *                        type: string
 *                        example: 수화는 재밌다!
 *                      views: 
 *                        type: integer
 *                        example: 7
 *                      comments: 
 *                        type: integer
 *                        example: 4
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.get('/hot3/free', function (req, res, next) {
    dbConnection.query('SELECT * FROM posts WHERE board_name= ? ORDER BY views DESC LIMIT 3', 'free', (error, rows) => {
        if (error) {
            res.status(500).send('DB Error: 로그 확인해주세요.'); 
            logger.log('error', error);
        }
        else {
            if (!rows.length) {
                final_result = {
                    "isSuccess": true,
                    "code": 1000,
                    "message": "성공", 
                    "result": []
                }
                
                
                res.status(200).send(final_result)
                
                //res.status(404).send('게시글이 존재하지 않음.')
            }
            else {
                result = []
                for (var data of rows) {
                    item = {}
                    item['board'] = data['board_name']
                    item['post_id'] = data['post_id']
                    item['title'] = data['title']
                    item['views'] = data['views']
                    item['comments'] = data['comments']
                    result.push(item)
                }

                res.status(200).send(result)
            }
        }
    })
});
//제일 조회수 많은 top3 -정보게
/**
 * @swagger
 * paths:
 *   /boards/hot3/info:
 *     get:
 *       summary: "정보게시판에서 가장 조회수가 많은 게시글의 목록을 보여준다."
 *       description: "정보게시판에서 가장 조회수가 많은 게시글의 게시판 제목, 게시글 제목, 조회수, 댓글수를 보여준다."
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (게시글 목록 불러오기 성공)
 *            content: 
 *              application/json: 
 *                schema: 
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties: 
 *                      board_name: 
 *                        type: string
 *                        example: info
 *                      post_id: 
 *                        type: integer
 *                        example: 4
 *                      title: 
 *                        type: string
 *                        example: 2023년 수화 시험 일정
 *                      views: 
 *                        type: integer
 *                        example: 7
 *                      comments: 
 *                        type: integer
 *                        example: 4
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.get('/hot3/info', function (req, res, next) {
    dbConnection.query('SELECT * FROM posts WHERE board_name= ? ORDER BY views DESC LIMIT 3', 'info', (error, rows) => {
        if (error) {
            res.status(500).send('DB Error: 로그 확인해주세요.'); 
            logger.log('error', error);
        }
        else {
            if (!rows.length) {
                final_result = {
                    "isSuccess": true,
                    "code": 1000,
                    "message": "성공", 
                    "result": []
                }
                
                
                res.status(200).send(final_result)
                
                //res.status(404).send('게시글이 존재하지 않음.')
            }
            else {
                result = []
                for (var data of rows) {
                    item = {}
                    item['board'] = data['board_name']
                    item['post_id'] = data['post_id']
                    item['title'] = data['title']
                    item['views'] = data['views']
                    item['comments'] = data['comments']
                    result.push(item)
                }

                res.status(200).send(result)
            }
            //console.log(rows)
        }
    })
});
// 작성된 시간 역순으로 리스트 보여주기 -자유게
/**
 * @swagger
 * paths:
 *   /boards/free:
 *     get:
 *       summary: "자유게시판의 게시글의 목록을 보여준다."
 *       description: "자유게시판의 게시글의 게시판 제목, 게시글 제목, 조회수, 댓글수를 보여준다."
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (게시글 목록 불러오기 성공)
 *            content: 
 *              application/json: 
 *                schema: 
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties: 
 *                      board_name: 
 *                        type: string
 *                        example: free
 *                      post_id: 
 *                        type: integer
 *                        example: 4
 *                      title: 
 *                        type: string
 *                        example: 수화는 재밌다!
 *                      body: 
 *                        type: string
 *                        example: 수화 너무 너무 재밌네요~~
 *                      user_email: 
 *                        type: string
 *                        example: mjluckk2@gmail.com
 *                      views: 
 *                        type: integer
 *                        example: 7
 *                      comments: 
 *                        type: integer
 *                        example: 4
 *                      created_at: 
 *                        type: string
 *                        example: "2023-11-05 13:04:31"
 *                      hashtag:
 *                        type: array
 *                        items: 
 *                          type: string
 *                          example: 재미, 동아리
 *                      writer: 
 *                         type: string
 *                         example: 루이테스트 
 *                         description: 글쓴이 닉네임
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.get('/free', function (req, res, next) {
    let func2 = function(user_email) {
        return new Promise(resolve => {
            dbConnection.query('SELECT * FROM users WHERE user_email = ?', user_email, (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {
                    //console.log(rows[0]['username'])
                    resolve(rows[0]['username']) 
                }
            })
        })
        
    }

    let func4 = function() {
        var result = []

        return new Promise (resolve => {
            dbConnection.query('SELECT * FROM posts WHERE board_name= ? ORDER BY created_at DESC', 'free', (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {
                    if (!rows.length) {
                        final_result = {
                            "isSuccess": true,
                            "code": 1000,
                            "message": "성공", 
                            "result": []
                        }
                        
                        
                        res.status(200).send(final_result)
                        
                        //res.status(404).send('게시글이 존재하지 않음.')
                    }
                    else {
                        //result = []
                        for (var data of rows) {
                            item = {}
                            //result = {}
                            //console.log(data)
                            var user_email = data['user_email']
        
                            item['board_name'] = data['board_name']
                            item['post_id'] = data['post_id']
                            item['title'] = data['title']
                            item['body'] = data['body']
                            item['user_email'] = data['user_email']
                            item['views'] = data['views']
                            item['comments'] = data['comments']
                            item['created_at'] = JSON.stringify(data['created_at']).replace(/"/, '').replace(/T/, ' ').replace(/\..+/, '')
                            if (data['hashtag']) {
                                item['hashtag'] = data['hashtag'].split(', ')
                            }
                            else {
                                item['hashtag'] = []
                            }
                            
                            result.push(item)
                        }
                        resolve(result)
                    }
                    //console.log(rows)
                }
            })
        })
    }

    //console.log('item1: ', item)
    // item['writer'] = func2(data['user_email'], function(x) {
    //     return(x)
    // })
    // console.log('item[writer]: ', func2(data['user_email'], function(x) {
    //     return(x)
    // }))
    let test3 = async function() {
        let return_result = func4()

        result = []
        for (var data of await return_result) {
            let writer = func2(data['user_email'])

            data['writer'] = await writer

            result.push(data)
        }

        if (! result.length) {
            res.status(404).send('검색 결과 없음!')
        }
        else {
            res.status(200).send(result)
        }
        //console.log(data['user_email'])
        // item['writer'] = await func2(data['user_email']);
        // result.push(item)
        // console.log('item2: ', item)
        //console.log(item['writer'])
    }
    (async () => {
        let aa = await test3();
        
        // result.push(item)
        //console.log(item)
        
    })
});
// 작성된 시간 역순으로 리스트 보여주기 -정보게
/**
 * @swagger
 * paths:
 *   /boards/info:
 *     get:
 *       summary: "정보게시판의 게시글의 목록을 보여준다."
 *       description: "정보게시판의 게시글의 게시판 제목, 게시글 제목, 조회수, 댓글수를 보여준다."
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (게시글 목록 불러오기 성공)
 *            content: 
 *              application/json: 
 *                schema: 
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties: 
 *                      board_name: 
 *                        type: string
 *                        example: info
 *                      post_id: 
 *                        type: integer
 *                        example: 4
 *                      title: 
 *                        type: string
 *                        example: 2023년 수화 시험 일정
 *                      body: 
 *                        type: string
 *                        example: 2023.11.8 수화 검정 시험 예정되어있습니다.
 *                      user_email: 
 *                        type: string
 *                        example: mjluckk2@gmail.com
 *                      views: 
 *                        type: integer
 *                        example: 7
 *                      comments: 
 *                        type: integer
 *                        example: 4
 *                      created_at: 
 *                        type: string
 *                        example: "2023-11-05 13:04:31"
 *                      hashtag:
 *                        type: array
 *                        items: 
 *                          type: string
 *                          example: 재미, 동아리
 *                      writer: 
 *                         type: string
 *                         example: 루이테스트 
 *                         description: 글쓴이 닉네임
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.get('/info', function (req, res, next) {
    let func2 = function(user_email) {
        return new Promise(resolve => {
            dbConnection.query('SELECT * FROM users WHERE user_email = ?', user_email, (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {
                    //console.log(rows[0]['username'])
                    resolve(rows[0]['username']) 
                }
            })
        })
        
    }

    let func4 = function() {
        var result = []

        return new Promise (resolve => {
            dbConnection.query('SELECT * FROM posts WHERE board_name= ? ORDER BY created_at DESC', 'info', (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {
                    if (!rows.length) {
                        final_result = {
                            "isSuccess": true,
                            "code": 1000,
                            "message": "성공", 
                            "result": []
                        }
                        
                        
                        res.status(200).send(final_result)
                        
                        //res.status(404).send('게시글이 존재하지 않음.')
                    }
                    else {
                        //result = []
                        for (var data of rows) {
                            item = {}
                            //result = {}
                            //console.log(data)
                            var user_email = data['user_email']
        
                            item['board_name'] = data['board_name']
                            item['post_id'] = data['post_id']
                            item['title'] = data['title']
                            item['body'] = data['body']
                            item['user_email'] = data['user_email']
                            item['views'] = data['views']
                            item['comments'] = data['comments']
                            item['created_at'] = JSON.stringify(data['created_at']).replace(/"/, '').replace(/T/, ' ').replace(/\..+/, '')
                            if (data['hashtag']) {
                                item['hashtag'] = data['hashtag'].split(', ')
                            }
                            else {
                                item['hashtag'] = []
                            }
                            
                            result.push(item)
                        }
                        resolve(result)
                    }
                    //console.log(rows)
                }
            })
        })
    }

    //console.log('item1: ', item)
    // item['writer'] = func2(data['user_email'], function(x) {
    //     return(x)
    // })
    // console.log('item[writer]: ', func2(data['user_email'], function(x) {
    //     return(x)
    // }))
    let test3 = async function() {
        let return_result = func4()

        result = []
        for (var data of await return_result) {
            let writer = func2(data['user_email'])

            data['writer'] = await writer

            result.push(data)
        }

        if (! result.length) {
            res.status(404).send('검색 결과 없음!')
        }
        else {
            res.status(200).send(result)
        }
        //console.log(data['user_email'])
        // item['writer'] = await func2(data['user_email']);
        // result.push(item)
        // console.log('item2: ', item)
        //console.log(item['writer'])
    }
    (async () => {
        let aa = await test3();
        
        // result.push(item)
        //console.log(item)
        
    })
});
/**
 * @swagger
 * paths:
 *   /boards/posts:
 *     get:
 *       summary: "게시글 가져오기"
 *       description: "게시글 내용을 보여준다."
 *       parameters:
 *         - in: query
 *           name: post_id
 *           schema: 
 *             type: integer
 *           required: true
 *           example: 10
 *           description: 게시글 번호 
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (게시글 불러오기 성공)
 *            content: 
 *              application/json: 
 *                schema: 
 *                  type: object
 *                  properties: 
 *                    post_id: 
 *                      type: integer
 *                      example: 10
 *                    board_name: 
 *                      type: string
 *                      example: info
 *                    title: 
 *                      type: string
 *                      example: 2023년 수화 시험 일정
 *                    body: 
 *                      type: string
 *                      example: 각자 알아보아요~
 *                    writer: 
 *                      type: string
 *                      example: 루이
 *                    views: 
 *                      type: integer
 *                      example: 6
 *                    created_at: 
 *                      type: string 
 *                      example: 2023-09-28 14:29:47
 *                    hashtag:
 *                      type: array
 *                      items: 
 *                        type: string
 *                        example: 재미, 동아리
 *         "412": 
 *            description: 파라미터 입력 오류
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.get('/posts', function (req, res, next) {

    
    if (req.query.post_id) {
        post_id = req.query.post_id
        dbConnection.query('SELECT * FROM posts WHERE post_id = ?', post_id, (error, rows) => {
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
                    //res.status(404).send('입력된 post_id(게시글 번호를) 가진 게시글이 존재하지 않음.')
                }
                else {
                    result = {}
                    for (var data of rows) {                           
                        var user_email = data['user_email']
                        dbConnection.query('SELECT * FROM users WHERE user_email = ?', user_email, (error, rows) => {
                            if (error) {
                                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                logger.log('error', error);
                            }
                            else {



                                result['post_id'] = data['post_id']
                                result['board_name'] = data['board_name']
                                result['title'] = data['title']
                                result['body'] = data['body']
                                result['writer'] = rows[0]['username']
                                result['views'] = data['views']
                                result['created_at'] = JSON.stringify(data['created_at']).replace(/"/, '').replace(/T/, ' ').replace(/\..+/, '')
                                if (data['hashtag']) {
                                    result['hashtag'] = data['hashtag'].split(', ')
                                }
                                else {
                                    result['hashtag'] = []
                                }
                                //console.log(data['post_id'])
                                dbConnection.query('UPDATE posts SET views = views +1 WHERE post_id = ? ', data['post_id'], (error, rows) => {
                                    if (error) {
                                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                        logger.log('error', error);
                                    }
                                    else {
                                        //console.log('update 성공')
                                        res.status(200).send(result)
                                        //res.status(200).send('댓글 저장 성공!')
                                        //logger.log('info', '댓글 저장 성공!')
                                    }
                                })

                            }
                        })
                    }
                } 
            } 
        })
    }
    else{ 
        logger.log('error', '파라미터 오류')
            //res.sendStatus(412)
            res.status(412).send('파라미터 입력 오류!')
    }
});
/**
 * @swagger
 * paths:
 *   /boards/comments?{post_id}:
 *     get:
 *       summary: "게시글의 댓글 목록 가져오기"
 *       description: "게시글 댓글을 보여준다."
 *       parameters:
 *         - in: query
 *           name: post_id
 *           schema: 
 *             type: integer
 *           required: true
 *           description: 게시글 번호 
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (댓글 불러오기 성공)
 *            content: 
 *              application/json: 
 *                schema: 
 *                  type: object
 *                  properties: 
 *                    post_id: 
 *                      type: integer
 *                      example: 10
 *                      description: DB 상에서의 게시글 id
 *                    comment_id: 
 *                      type: integer
 *                      example: 1
 *                      description: DB 상에서의 댓글 id
 *                    body: 
 *                      type: string
 *                      example: 좋은 내용 감사합니당 
 *                      description: 댓글 내용
 *                    writer: 
 *                      type: string
 *                      example: 루이3
 *                      description: 댓글 작성자
 *                    created_at: 
 *                      type: string
 *                      description: 댓글 생성 시간
 *                      example: 2023-09-28 14:29:47
 *         "412": 
 *            description: 파라미터 입력 오류
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.get('/comments', function (req, res, next) {
    if (req.query.post_id) {
        post_id = req.query.post_id
        
        dbConnection.query('SELECT * FROM comments WHERE post_id = ?', post_id, (error, rows) => {
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
                    final_result = {}
                    final_result["isSuccess"] = true
                    final_result["code"] = 1000
                    final_result["message"] = "성공"
                    result = []

                    rows.forEach((data, index) => {
                        var user_email = data['user_email']
                        
                        dbConnection.query('SELECT * FROM users WHERE user_email = ?', user_email, (error, data2) => {
                            if (error) {
                                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                logger.log('error', error);
                            }
                            else {
                                
                                comment = {}
                                comment['post_id'] = data['post_id']
                                comment['comment_id'] = data['comment_id']
                                comment['body'] = data['body']
                                comment['writer'] = data2[0]['username']
                                comment['created_at'] = JSON.stringify(data['created_at']).replace(/"/, '').replace(/T/, ' ').replace(/\..+/, '')
                                result.push(comment)
                                if (index == (rows.length-1)) {
                                    final_result["result"] = result
                                    res.status(200).send(final_result)
                                }
                            }
                        })
                    } )
            } }
        })
    }
    else{ 
        logger.log('error', '파라미터 오류')
            //res.sendStatus(412)
            res.status(412).send('파라미터 입력 오류!')
    }
});



var filename = "./AI/NLP/input_text2.txt"



let writeContext = function(body) {
    return new Promise(resolve => {
        fs.appendFile(filename, '\n'+ body, function(err) {
            if(err) {
                return console.log(err)
            }
            else {
                console.log('file modified.')
                resolve("success")
            }
        })

        
    })
}

let writeTitle = function(title) {
    return new Promise(resolve => {
        fs.writeFile(filename, title, function(err) {
            if(err) {
                return console.log(err)
            }
            else {
                console.log('file saved.')
                resolve("success")
            }
        })

        
    })
}




/**
 * @swagger
 * paths:
 *   /boards/posts/write:
 *     post:
 *       summary: "게시글 작성하기"
 *       description: "새 게시글을 저장한다."
 *       requestBody:
 *         required: True
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title: 
 *                   type: string
 *                   example: 수화 너무 재밌지 않나용
 *                   description: 글 제목
 *                 body: 
 *                   type: string
 *                   example: 시작한지 하루밖에 안됐지만 너무 재밌어서 진작 시작할 걸 그랬어요~
 *                   description: 글 내용
 *                 hashtag:
 *                   type: string
 *                   example: 재미, 동아리
 *                   description: 없으면 안 보내도 됨.
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (새 게시글 저장 성공)
 *            content: 
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    board_name:
 *                      type: string
 *                      example: info
 *                      description: 모델이 판단한 게시판 분류로 정보게이면 info, 자유게이면 free
 *                    title: 
 *                      type: string
 *                      example: 수화 너무 재밌지 않나용
 *                      description: 글 제목
 *                    body: 
 *                      type: string
 *                      example: 시작한지 하루밖에 안됐지만 너무 재밌어서 진작 시작할 걸 그랬어요~
 *                      description: 글 내용
 *                    hashtag:
 *                      type: string
 *                      example: 재미, 동아리
 *                      description: 없으면 안 보내도 됨.
 *                    writer:
 *                      type: string
 *                      exmaple: mjluckk2@gmail.com
 *                      description: 로그인한 사용자 이메일
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "412": 
 *            description: 파라미터 입력 오류1 -> req.body.title과 req.body.body 입력 필요.
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.post('/posts/write', function (req, res, next) {
    if (req.session.useremail) {
        writer = req.session.useremail
        if (req.body.title && req.body.body) {
            //var final_result = {}    
            title = req.body.title
            body = req.body.body
            context = title + body
            
            console.log("==============")
            //f = open('../input_file/input_file.txt', 'w')
            
            let makeFile = async function() {
                const { spawn } = require('child_process');
                const python = spawn('python', ['./AI/NLP/notice_board_test_code.py'])

                let result1 = writeTitle(title)
                if (await result1 == "success") {
                    let result2 = writeContext(body) 
                    if (await result2 == "success") {
                        if (req.body.hashtag) {
                            hashtag = req.body.hashtag
                        }
                        else {
                            hashtag = null
                        }

                        
                        python.stdout.on('data', (data) => {
                            //console.log('data: ', data)
                            let json = JSON.stringify(data)
                            let bufferOriginal = Buffer.from(JSON.parse(json).data);
                            //console.log(bufferOriginal)
                            let decision = bufferOriginal.toString().replace(/(\r\n|\n|\r)/gm, "")
                            console.log('bufferOriginal: '+ decision)
                            
                            if (decision == "Free Noticeboard") {
                                
                                board = 'free' 
 
                            }
                            else if (decision == "Information Noticeboard") {

                                board = 'info'
                            
                            }
                            // final_result['board_name']
                            // final_result['title'] = title
                            // final_result['body'] = body
                            // final_result['hashtag'] = req.body.hashtag
                            // final_result['writer'] = writer
                            ins = [board, title, body, writer, hashtag]

                                dbConnection.query('INSERT INTO posts (`board_name`, `title`, `body`, `user_email`, `hashtag`) VALUES (?, ?, ?, ?, ?)', ins, (error, rows) => {
                                    if (error) {
                                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                        logger.log('error', error);
                                    }
                                    else {
                                        //res.status(200).send('새 게시글 저장 성공!')
                                        res.status(200).send({"board_name": board, "title": title, "body": body, "hashtag": hashtag, "writer": writer})
                                        logger.log('info', '새 게시글 저장 성공!')
                                    }
                                })

                        })
                        python.stderr.on('data', function(data) {
                            res.send(data.toString)
                        })
                        
                    }
                }
            }
            
            (async () => {
                let start = await makeFile()
            })

            
        }
        else {
            logger.log('error', '파라미터 오류')
            res.status(412).send('파라미터 입력 오류2: req.body.title과 req.body.body 입력 필요.')
        }
    }
    else {
        res.status(401).send( '로그인하지 않았음!')
        logger.log('error', '로그인하지 않았음!')
    }
});
/**
 * @swagger
 * paths:
 *   /boards/posts/delete/{post_id}:
 *     post:
 *       summary: "게시글 삭제"
 *       description: "사용자가 자신이 작성한 게시글을 삭제한다."
 *       parameters:
 *         - in: path
 *           name: post_id
 *           schema: 
 *             type: integer
 *           required: true
 *           description: 삭제할 게시글 번호
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (게시글 삭제 성공)
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "403": 
 *            description: 해당 사용자가 작성한 게시글이 아님.
 *         "404": 
 *            description: 해당 post_id(게시글 번호)를 가진 게시글이 존재하지 않음.
 *         "412": 
 *            description: 파라미터 입력 오류. 정확한 파라미터 명과 개수 입력 필요
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인
 *         
 *         
 * 
 */
router.post('/posts/delete/:post_id', function (req, res, next) {
    if (req.session.useremail) {
        writer = req.session.useremail
        if (req.params.post_id) {
            post_id = req.params.post_id
            ins = [post_id, writer]

            dbConnection.query('SELECT * FROM posts WHERE post_id = ?', post_id, (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {
                    if (! rows.length) {
                        res.status(404).send('해당 post_id(게시글 번호)를 가진 게시글이 존재하지 않음.')
                    }
                    else {
                        for (var data of rows) {
                            if (writer == data['user_email']) {
                                dbConnection.query('DELETE FROM posts WHERE post_id = ? AND user_email = ?', ins, (error, rows) => {
                                    if (error) {
                                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                        logger.log('error', error);
                                    }
                                    else {

                                        dbConnection.query('DELETE FROM comments WHERE post_id = ?', post_id, (error, rows) => {
                                            if (error) {
                                                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                                logger.log('error', error);
                                            }
                                            else {
                                                res.status(200).send('성공적으로 게시글을 삭제함!')
                                                logger.log('info', '성공적으로 게시글을 삭제함!')
                                            }
                                        })
                                    }
                                })
                            }
                            else {
                                res.status(403).send('해당 사용자가 작성한 게시글이 아님!')
                                logger.log('error', '해당 사용자가 작성한 게시글이 아님.')
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
        res.status(401).send('You are not logged in!')
        logger.log('error', '로그인하지 않았음!')
    }
});
/**
 * @swagger
 * paths:
 *   /board/posts/revise/{post_id}:
 *     post:
 *       summary: "게시글 수정"
 *       description: "사용자가 자신이 작성한 게시글을 수정한다."
 *       parameters:
 *         - in: path
 *           name: post_id
 *           schema: 
 *             type: integer
 *           required: true
 *           description: 수정할 게시글 번호
 *       requestBody:
 *         required: True
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title: 
 *                   type: string
 *                   example: 수화 너무 어려워요ㅠ
 *                   description: 수정할 제목 내용. 이 내용으로 수정된다.
 *                 body: 
 *                   type: string
 *                   example: 시작한지 일주일 지났는데 진도도 안나가지고 너무 어렵네요,, 저랑 같이 공부하실 분 있을까요..?ㅠ
 *                   description: 수정할 글 내용. 이 내용으로 수정된다.
 *                 hashtag:
 *                   type: string
 *                   example: 시험, 기출문제
 *                   description: 선택적으로 작성. 안 줘도 됨.
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (게시글 수정 성공)
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "403": 
 *            description: 해당 사용자가 작성한 게시글이 아님.
 *         "404": 
 *            description: 해당 post_id(게시글 번호)를 가진 게시글이 존재하지 않음.
 *         "412": 
 *            description: 파라미터 입력 오류. 정확한 파라미터 명과 개수 입력 필요
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인
 *         
 *         
 * 
 */
router.post('/posts/revise/:post_id', function (req, res, next) {
    if (req.session.useremail) {
        writer = req.session.useremail

        if (req.params.post_id && req.body.title && req.body.body) {
            post_id = req.params.post_id
            new_title = req.body.title
            new_body = req.body.body
            console.log(new_title, new_body)
            if (req.body.hashtag) {
                hashtag = req.body.hashtag
            }
            else {
                hashtag = null
            }
            ins = [new_title, new_body, hashtag, post_id]
            console.log(ins)
            dbConnection.query('SELECT * FROM posts WHERE post_id = ?', post_id, (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {
                    if (!rows.length) {
                        res.status(404).send('해당 post_id(게시글 번호)를 가진 게시글이 존재하지 않음.')
                    }
                    else {
                        
                        for (var data of rows) {
                            if (writer == data['user_email']) {
                                dbConnection.query('UPDATE posts SET title = ?, body = ?, hashtag = ? WHERE post_id = ?', ins, (error, rows) => {
                                    if (error) {
                                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                        logger.log('error', error);
                                    }
                                    else {
                                        res.status(200).send('성공적으로 게시글을 수정함!')
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
                }
                
            })
        }
        else {
            logger.log('error', '파라미터 오류')
            res.status(412).send('파라미터 입력 오류!')
        }
    }
    else {
        res.status(401).send('You are not logged in!')
        logger.log('error', '로그인하지 않았음!')
    }
});
/**
 * @swagger
 * paths:
 *   /boards/comments/write/{post_id}:
 *     post:
 *       summary: "댓글 작성하기"
 *       description: "새 댓글을 저장한다."
 *       parameters:
 *         - in: path
 *           name: post_id
 *           schema: 
 *             type: integer
 *             example: 10
 *           required: true
 *           description: 게시물 번호- 댓글을 입력할 게시글의 번호
 *       requestBody:
 *         required: True
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body: 
 *                   type: string
 *                   example: 공감해요~ 수화 재미있더라구요
 *                   description: 댓글 내용
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (새 게시글 저장 성공)
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "404": 
 *            description: 입력된 post_id(게시글 번호를) 가진 게시글이 존재하지 않음.
 *         "412": 
 *            description: 파라미터 입력 오류1 -> req.body.title과 req.body.body 입력 필요.
 *         "417": 
 *            description: 파라미터 입력 오류1-> board_name은 free와 info 중 하나로 입력해야 함
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.post('/comments/write/:post_id', function (req, res, next) {
    if (req.session.useremail) {
        writer = req.session.useremail
        if (req.params.post_id) {
            post_id = req.params.post_id  
            if (req.body.body) {
                
                body = req.body.body

                ins = [post_id, body, writer]

                dbConnection.query('SELECT * FROM posts WHERE post_id = ?', post_id, (error, rows) => {
                    if (error) {
                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                        logger.log('error', error);
                    }
                    else {
                        if (!rows.length) {
                            res.status(404).send('입력된 post_id(게시글 번호를) 가진 게시글이 존재하지 않음.')
                        }
                        else {
                            dbConnection.query('INSERT INTO comments (`post_id`, `body`, `user_email`) VALUES (?, ?, ?)', ins, (error, rows) => {
                                if (error) {
                                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                    logger.log('error', error);
                                }
                                else {

                                    dbConnection.query('UPDATE posts SET comments= comments +1 WHERE post_id = ? ', post_id, (error, rows) => {
                                        if (error) {
                                            res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                            logger.log('error', error);
                                        }
                                        else {
                                            res.status(200).send('댓글 저장 성공!')
                                            logger.log('info', '댓글 저장 성공!')
                                        }
                                    })
                                    
                                }
                            })
                        }
                    }
                })  
            }
            else {
                logger.log('error', '파라미터 오류')
                res.status(412).send('파라미터 입력 오류2: req.params.post_id 입력 필요.')
            }
            
        }
        else {
            logger.log('error', '파라미터 오류')
            res.status(417).send('파라미터 입력 오류1: board_name은 free와 info 중 하나로 입력해야 함.')
        }
    }
    else {
        res.status(401).send( '로그인하지 않았음!')
        logger.log('error', '로그인하지 않았음!')
    }
});
/**
 * @swagger
 * paths:
 *   /boards/comments/delete/{post_id}/{comment_id}:
 *     post:
 *       summary: "게시글 삭제"
 *       description: "사용자가 자신이 작성한 게시글을 삭제한다."
 *       parameters:
 *         - in: path
 *           name: post_id
 *           schema: 
 *             type: integer
 *           required: true
 *           description: 삭제할 게시글 번호
 *         - in: path
 *           name: comment_id
 *           schema: 
 *             type: integer
 *           required: true
 *           description: 삭제할 댓글 번호
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (게시글 삭제 성공)
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "403": 
 *            description: 해당 사용자가 작성한 댓글이 아님.
 *         "404": 
 *            description: 해당 post_id(게시글 번호)를 가진 게시글이 존재하지 않음.
 *         "412": 
 *            description: 파라미터 입력 오류. 정확한 파라미터 명과 개수 입력 필요
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인
 *         
 *         
 * 
 */
router.post('/comments/delete/:post_id/:comment_id', function (req, res, next) {
    if (req.session.useremail) {
        writer = req.session.useremail
        if (req.params.post_id && req.params.comment_id) {
            post_id = req.params.post_id  
            comment_id = req.params.comment_id


            ins = [post_id, comment_id]

            dbConnection.query('SELECT * FROM posts WHERE post_id = ?', post_id, (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {
                    if (!rows.length) {
                        res.status(404).send('입력된 post_id(게시글 번호를) 가진 게시글이 존재하지 않음.')
                    }
                    else {

                        for (var data of rows) {
                            if (writer == data['user_email']) {
                                dbConnection.query('DELETE FROM comments WHERE post_id = ? AND comment_id = ?', ins, (error, rows) => {
                                    if (error) {
                                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                        logger.log('error', error);
                                    }
                                    else {
                                        res.status(200).send('댓글 삭제 성공!')
                                        logger.log('info', '댓글 삭제 성공!')
                                    }
                                })
                            }
                            else {
                                res.status(403).send('해당 사용자가 작성한 댓이 아님!')
                                logger.log('error', '해당 사용자가 작성한 댓이 아님.')
                            }
                        }
                        
                    }
                }
            })  
            
        }
        else {
            logger.log('error', '파라미터 오류')
            res.status(412).send('파라미터 입력 오류1: board_name은 free와 info 중 하나로 입력해야 함.')
        }
    }
    else {
        res.status(401).send( '로그인하지 않았음!')
        logger.log('error', '로그인하지 않았음!')
    }
});
/**
 * @swagger
 * paths:
 *   /boards/comments/revise/{comment_id}:
 *     post:
 *       summary: "댓글 수정하기"
 *       description: "댓글을 저장한다."
 *       parameters:
 *         - in: path
 *           name: comment_id
 *           schema: 
 *             type: integer
 *             example: 5
 *           required: true
 *           description: 수정할 댓글 번호
 *       requestBody:
 *         required: True
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body: 
 *                   type: string
 *                   example: 공감해요~ 수화 재미있더라구요
 *                   description: 댓글 내용-> 해당 내용으로 댓글이 수정됨.
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (댓글 수정 성공)
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "403": 
 *            description: 사용자가 작성한 댓글이 아님. (다른 사람이 작성한 댓글)
 *         "404": 
 *            description: 입력된 comment_id(댓글 번호를) 가진 댓글이 존재하지 않음.
 *         "412": 
 *            description: 파라미터 입력 오류2 -> req.body.body 입력 필요
 *         "417": 
 *            description: 파라미터 입력 오류1-> req.params.comment_id 입력 필요
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.post('/comments/revise/:comment_id', function (req, res, next) {
    if (req.session.useremail) {
        writer = req.session.useremail
        if (req.params.comment_id) {
            comment_id = req.params.comment_id
            if (req.body.body) {
                body = req.body.body
                ins = [body, comment_id]
                //ins = [post_id, comment_id]

            dbConnection.query('SELECT * FROM comments WHERE comment_id = ?', comment_id, (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', error);
                }
                else {
                    if (!rows.length) {
                        res.status(404).send('입력된 comment_id(댓글 번호를) 가진 댓글이 존재하지 않음.')
                    }
                    else {

                        for (var data of rows) {
                            console.log(data['user_email'])
                            if (writer == data['user_email']) {
                                dbConnection.query('UPDATE comments SET body = ? WHERE comment_id = ?', ins, (error, rows) => {
                                    if (error) {
                                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                        logger.log('error', error);
                                    }
                                    else {
                                        res.status(200).send('댓글 수정 성공!')
                                        logger.log('info', '댓글 수정 성공!')
                                    }
                                })
                            }
                            else {
                                res.status(403).send('해당 사용자가 작성한 댓글이 아님!')
                                logger.log('error', '해당 사용자가 작성한 댓글이 아님.')
                            }
                        }
                        
                    }
                }
            })  

            }
            else {
                logger.log('error', '파라미터 오류')
                res.status(412).send('파라미터 입력 오류2: req.body.body 입력 필요.')
            }  
        }
        else {
            logger.log('error', '파라미터 오류')
            res.status(417).send('파라미터 입력 오류1: req.params.comment_id 입력 필요')
        }
    }
    else {
        res.status(401).send( '로그인하지 않았음!')
        logger.log('error', '로그인하지 않았음!')
    }
});





 /**
 * @swagger
 * paths:
 *   /boards/posts/upload?{post_id}:
 *     post:
 *       summary: "게시글에 첨부파일 업로드"
 *       description: "게시글에 첨부파일을 업로드한다."
 *       consumes: 
 *         - multipart/form-data
 *       parameters:     
 *         - in: query
 *           name: post_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: 게시글 번호
 *       requestBody:
 *         required: True
 *         content:
 *           multipart/form-data:
 *             schema: 
 *               type: object
 *               properties:
 *                 file: 
 *                   type: string
 *                   format: binary
 *         description: 스웨거에서는 영문이름 파일만 정상작동함. 포스트맨은 한글이름 파일도 상관 없음. 
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공
 *            content: 
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    success:
 *                      type: boolean
 *                      example: true
 *                    url:
 *                      type: string 
 *                      example: "..\\Backend\\board_files\\1\\우주.mp4"
 *                    fileName:
 *                      type: string
 *                      example: "우주.mp4"
 * 
 *         "400":
 *           description: 요청 실패
 *           content: 
 *             application/json:
 *               schema: 
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   err: 
 *                     type: err
 *         "402":       
 *           description: 서버 내 폴더 생성 오류
 *         "417":
 *           description: 파라미터 입력 오류- req.query.post_id 
 *         
 */
router.post('/posts/upload', function (req, res, next) {
    if (req.query.post_id) {
        const post_id = req.query.post_id
        var dir_path = '../Backend/board_files/' + post_id
        //console.log(dir_path)
        if (!fs.existsSync(dir_path)) {
            try{
                fs.mkdirSync(dir_path);
            }
            catch(e) {
                res.status(402).send('폴더 생성 오류')
            }
        } 

        let storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, dir_path + "/");
            },
            filename: (req, file, cb) => {
                console.log('file.originalname')
                fn = file.originalname.toString('utf8');
                console.log('fn')
                cb(null, `${fn}`);
        
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
            return res.status(200).json({
                success: true,
                url: res.req.file.path,
                fileName: res.req.file.filename,
            })
        })
    }
    else {
        logger.log('error', '파라미터 오류')
        res.status(417).send('파라미터 입력 오류1: req.query.post_id 입력 필요')
    }

    

})

 /**
 * @swagger
 * paths:
 *   /boards/posts/download?{post_id}&{fileName}:
 *     get:
 *       summary: "첨부파일 다운로드"
 *       description: "게시글의 첨부파일 다운로드"
 *       parameters:     
 *         - in: query
 *           name: post_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: 게시글 번호
 *           example: 11
 *         - in: query
 *           name: fileName
 *           schema:
 *             type: string
 *             required: true
 *             description: 다운받으려는 파일 이름
 *             example: 한국수어사전_2023_3.pdf
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 다운로드 성공
 *         "400":
 *           description: 다운로드 오류 + 에러
 *         "401":       
 *           description: 해당 게시글의 첨부파일 없음
 *         "402":       
 *           description: 해당 파일 없음
 *         "417":
 *           description:  파라미터 입력 오류-req.query.post_id와 req.quest.fileName 입력 필요.
 *         
 */
router.get('/posts/download', function (req, res, next) {
    if (req.query.post_id && req.query.fileName) {
        const post_id = req.query.post_id
        const fileName = decodeURIComponent(req.query.fileName);
        if (!fs.existsSync('../Backend/board_files/'+post_id)) {
            res.status(401).send('해당 게시글의 첨부파일 없음.')
        }
        else {
            if (!fs.existsSync('../Backend/board_files/'+post_id+'/'+ fileName)) {
                res.status(402).send('해당 파일 없음')
            }
            else {
                try {
                    res.status(200).download('../Backend/board_files/'+post_id+'/'+ fileName);
                }
                catch(e) {
                    res.status(400).send('다운로드 오류' + e)
                }
            }
    
        }
        
    }
    else {
        logger.log('error', '파라미터 오류')
        res.status(417).send('파라미터 입력 오류1: req.query.post_id와 req.query.fileName 입력 필요')
    }
    

})


 /**
 * @swagger
 * paths:
 *   /boards/posts/files?{post_id}:
 *     get:
 *       summary: "첨부파일 목록"
 *       description: "게시글의 첨부파일 목록을 보여준다. "
 *       parameters:     
 *         - in: query
 *           name: post_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: 게시글 번호
 *           example: 11
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 첨부파일 목록 보여주기 성공
 *            example: ["1_space.mp4", "2_space.mp4"]
 *         "401":       
 *           description: 해당 게시글의 첨부파일 없음
 *         "402":       
 *           description: file read 오류
 *         "417":
 *           description:  파라미터 입력 오류-req.query.post_id입력 필요.
 *         
 */
 router.get('/posts/files', function (req, res, next) {
    if (req.query.post_id) {
        const post_id = req.query.post_id
        
        if (!fs.existsSync('../Backend/board_files/'+post_id)) {
            res.status(401).send('해당 게시글의 첨부파일 없음.')
        }
        else {
            file_list = []
            fs.readdir('../Backend/board_files/'+post_id, (err, files) => {

                if (err) {
                    res.status(402).send('file read 오류')
                }
                files.forEach(file => {
                    file_list.push(file)
                })

                res.status(200).send(file_list)
            })
        }
        
    }
    else {
        logger.log('error', '파라미터 오류')
        res.status(417).send('파라미터 입력 오류1: req.query.post_id와 req.query.fileName 입력 필요')
    }
    

})
 /**
 * @swagger
 * paths:
 *   /boards/notice/7:
 *     get:
 *       summary: "실시간 공고"
 *       description: "가장 최근 7개의 실시간 공고들을 보여준다. "
 *       tags: [Boards]
 *       responses:
 *         "200":
 *           description: 요청 성공
 *           content: 
 *             application/json:
 *               schema: 
 *                 type: array
 *                 items:
 *                  type: object
 *                  properties: 
 *                    title: 
 *                      type: string
 *                      example: 2023년 제2차 한국수어교원 자격 부여(개인 자격 심사) 계획 공고
 *                    qualification:
 *                      type: string
 *                      example: 개인
 *                      description: 없으면 - 으로 나옴.(한국수어교원 홈페이지처럼)
 *                    period: 
 *                      type: string
 *                      example: 2023/09/07 ~ 2023/11/17
 *                      description: 없으면 - 으로 나옴.(한국수어교원 홈페이지처럼)
 *         "400":
 *           description: 요청 실패
 *           content: 
 *             application/json:
 *               schema: 
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   error: 
 *                     type: err
 *         
 */
router.get('/notice/7', function (req, res, next) {

    //const file_path = '../Backend/notices.csv'
    const file_path = './notices.csv'
    const csv = fs.readFileSync(file_path, "utf-8", )
    const rows = csv.split('\r\n')
    var result = []
    for (var i = 1; i < 8; i++) {
        list = rows[i].split(';')
        title = list[0]
        quali = list[1]
        period = list[2]
        
        var row = [{
            'title': title,
            'qualification': quali,
            'period': period

        }]
        //var scriptName = path.basename(__filename);
        //console.log(path.basename(path.dirname(scriptName)))
        result = result.concat(row)
    }
    try {
        res.status(200).send(result)
    } catch (error) {
        var result = {
            'success': false,
            'error': error,
        }
        
        res.status(400).send(result)
    }
    
})

module.exports = router;

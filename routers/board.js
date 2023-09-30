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
 *                      views: 
 *                        type: integer
 *                        example: 7
 *                      comments: 
 *                        type: integer
 *                        example: 4
 *         "404": 
 *            description: 게시글이 존재하지 않음.
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
                res.status(404).send('게시글이 존재하지 않음.')
            }
            else {
                result = []
                for (var data of rows) {
                    item = {}
                    item['boar_name'] = data['board_name']
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
 *         "404": 
 *            description: 게시글이 존재하지 않음.
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
                res.status(404).send('게시글이 존재하지 않음.')
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
 *         "404": 
 *            description: 게시글이 존재하지 않음.
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
                res.status(404).send('게시글이 존재하지 않음.')
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
 *                      views: 
 *                        type: integer
 *                        example: 7
 *                      comments: 
 *                        type: integer
 *                        example: 4
 *         "404": 
 *            description: 게시글이 존재하지 않음.
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.get('/free', function (req, res, next) {
    dbConnection.query('SELECT * FROM posts WHERE board_name= ? ORDER BY created_at DESC', 'free', (error, rows) => {
        if (error) {
            res.status(500).send('DB Error: 로그 확인해주세요.'); 
            logger.log('error', error);
        }
        else {
            if (!rows.length) {
                res.status(404).send('게시글이 존재하지 않음.')
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
 *                      views: 
 *                        type: integer
 *                        example: 7
 *                      comments: 
 *                        type: integer
 *                        example: 4
 *         "404": 
 *            description: 게시글이 존재하지 않음.
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.get('/info', function (req, res, next) {
    dbConnection.query('SELECT * FROM posts WHERE board_name= ? ORDER BY created_at DESC', 'info', (error, rows) => {
        if (error) {
            res.status(500).send('DB Error: 로그 확인해주세요.'); 
            logger.log('error', error);
        }
        else {
            if (!rows.length) {
                res.status(404).send('게시글이 존재하지 않음.')
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
/**
 * @swagger
 * paths:
 *   /boards/articles/{article_id}:
 *     get:
 *       summary: "게시글 가져오기"
 *       description: "게시글 내용을 보여준다."
 *       parameters:
 *         - in: path
 *           name: article_id
 *           schema: 
 *             type: integer
 *           required: true
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
 *                      example: 3
 *                    board_name: 
 *                      type: string
 *                      example: info
 *                    title: 
 *                      type: string
 *                      example: 2023년 수화 시험 일정
 *                    body: 
 *                      type: string
 *                      example: 각자 알아보아요~
 *                    views: 
 *                      type: integer
 *                      example: 6
 *                    created_at: 
 *                      type: string 
 *                      example: 2023-09-28 14:29:47
 *         "404": 
 *            description: 입력된 post_id(게시글 번호)를 가진 게시글이 존재하지 않음.
 *         "412": 
 *            description: 파라미터 입력 오류
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.get('/articles/:article_id', function (req, res, next) {
    if (req.params.article_id) {
        post_id = req.params.article_id

        dbConnection.query('SELECT * FROM posts WHERE post_id = ?', post_id, (error, rows) => {
            if (error) {
                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                logger.log('error', error);
            }

            else {
                if (! rows.length) {
                    res.status(404).send('입력된 post_id(게시글 번호를) 가진 게시글이 존재하지 않음.')
                }
                else {
                    for (var data of rows) {
                        var user_email = data['user_email']

                        result = {}
                        dbConnection.query('SELECT * FROM users WHERE user_email = ?', user_email, (error, rows) => {
                            if (error) {
                                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                logger.log('error', error);
                            }
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
                        result['created_at'] = JSON.stringify(data['created_at']).replace(/"/, '').replace(/T/, ' ').replace(/\..+/, '')
                        
                        res.status(200).send(result)
                        logger.log('info', 'article_id로 게시글 불러오기 성공!')
        
                        dbConnection.query('UPDATE posts SET views = views + 1 WHERE post_id = ?', data['post_id'], (error, rows) => {
                            if (error) {
                                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                logger.log('error', error);
                            }
                            else {
                                logger.log('info', '게시글 조회수 +1 성공!')
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
 *   /boards/articles/write/{board_name}:
 *     post:
 *       summary: "게시글 작성하기"
 *       description: "새 게시글을 저장한다."
 *       parameters:
 *         - in: path
 *           name: board_name
 *           schema: 
 *             type: string
 *             example: free
 *           required: true
 *           description: 게시판 이름- free(자유)와 info(정보) 중 하나 입력
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
 *       tags: [Boards]
 *       responses:
 *         "200":
 *            description: 요청 성공 (새 게시글 저장 성공)
 *         "401": 
 *            description: 로그인 되어 있지 않아서 제대로 기능하지 못함 
 *         "412": 
 *            description: 파라미터 입력 오류1 -> req.body.title과 req.body.body 입력 필요.
 *         "417": 
 *            description: 파라미터 입력 오류1-> board_name은 free와 info 중 하나로 입력해야 함
 *         "500": 
 *            description: 내부 오류 (DB오류) -> 자세한 오류 내용은 로그 확인 
 * 
 */
router.post('/articles/write/:board_name', function (req, res, next) {
    if (req.session.useremail) {
        writer = req.session.useremail
        if (req.params.board_name) {
            board = req.params.board_name  //free와 info 중 하나
            if (req.body.title && req.body.body) {
                title = req.body.title
                body = req.body.body

                ins = [board, title, body, writer]

                dbConnection.query('INSERT INTO posts (`board_name`, `title`, `body`, `user_email`) VALUES (?, ?, ?, ?)', ins, (error, rows) => {
                    if (error) {
                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                        logger.log('error', error);
                    }
                    else {
                        res.status(200).send('새 게시글 저장 성공!')
                        logger.log('info', '새 게시글 저장 성공!')
                    }
                })
            }
            else {
                logger.log('error', '파라미터 오류')
                res.status(412).send('파라미터 입력 오류2: req.body.title과 req.body.body 입력 필요.')
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
 *   /boards/articles/delete/{article_id}:
 *     post:
 *       summary: "게시글 삭제"
 *       description: "사용자가 자신이 작성한 게시글을 삭제한다."
 *       parameters:
 *         - in: path
 *           name: article_id
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
router.post('/articles/delete/:article_id', function (req, res, next) {
    if (req.session.useremail) {
        writer = req.session.useremail
        if (req.params.article_id) {
            post_id = req.params.article_id
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
                                        res.status(200).send('성공적으로 게시글을 삭제함!')
                                        logger.log('info', '성공적으로 게시글을 삭제함!')
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
 *   /boards/articles/revise/{article_id}:
 *     post:
 *       summary: "게시글 수정"
 *       description: "사용자가 자신이 작성한 게시글을 수정한다."
 *       parameters:
 *         - in: path
 *           name: article_id
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
router.post('/articles/revise/:article_id', function (req, res, next) {
    if (req.session.useremail) {
        writer = req.session.useremail

        if (req.params.article_id && req.body.title && req.body.body) {
            post_id = req.params.article_id
            new_title = req.body.title
            new_body = req.body.body
            console.log(new_title, new_body)
            ins = [new_title, new_body, post_id]
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
                                dbConnection.query('UPDATE posts SET title = ?, body = ? WHERE post_id = ?', ins, (error, rows) => {
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

router.post('/comments/write/:article_id', function (req, res, next) {

});

router.post('/comments/delete/:article_id/:comment_id', function (req, res, next) {

});

router.post('/comments/revise/:article_id/:comment_id', function (req, res, next) {

});

module.exports = router;

var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
var seedrandom = require('seedrandom')

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Index Page: Success!')
});



/**
 * @swagger
 * paths:
 *   /dictionary/main:
 *     get:
 *       summary: "사전 메인 페이지"
 *       description: "섹션 명과 오늘의 수어, 단어장 단어 Get 방식으로 요청"
 *       tags: [Dictionary]
 *       responses:
 *         "200":
 *            description: 요청 성공
 *            content: 
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    sections:
 *                      example: ["주생활", "삶", "인간", "경제생활", "식생활", "동식물", "정치와 행정", "교육", "사회생활", "기타", "나라명및지명", "자연", "개념", "의생활", "문화", "종교"]
 *                    todays:
 *                      type: object
 *                      example: 
 *                        [
 *                          {"video": "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200821/733647/MOV000252074_700X466.webm", "meaning": "마침,딱 맞다,알맞다"},
 *                          {"video": "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191029/632258/MOV000255801_700X466.webm", "meaning": "자유,임의,마구,마음껏,마음대로,멋대로,제멋대로,함부로"},
 *                          {"video": "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20221019/1042417/MOV000360965_700X466.webm", "meaning": "모세"}
 *                        ]
 *  
 *             
 * 
 * 
 */
router.get('/main', function (req, res, next) {
    result = {}
    var sections = [];

    const promise1 = new Promise((resolve, reject) => {
        dbConnection.query('SELECT * FROM sections', (error, rows) => {
            if (error) throw error;
    
            for (var data of rows) {
                sections.push(data['section'])
            }

            result['sections'] = [...new Set(sections)]

            resolve(result)
        })
    })
    var today = new Date();
    var year = today.getFullYear()
    var month = today.getMonth() + 1;
    var date = today.getDate();
    var today = year.toString() + month.toString() + date.toString()
    //console.log(today);
    //console.log(typeof month);
    seedrandom(today+'1', {global : true});
    first = Math.floor(Math.random() * 3669)
    seedrandom(today+'2', {global : true});
    second = Math.floor(Math.random() * 3669)
    seedrandom(today+'3', {global : true});
    third = Math.floor(Math.random() * 3669)
    var n = []
    n.push(first)
    n.push(second)
    n.push(third)
    // for (var i = 0; i < 3; i ++) {
    //     var num = getRndInteger(0, 3669)
    //     if (n.includes(num) === false) {
    //         n.push(num)
    //     }
    // }

    promise1.then((value) => {
        var todays = []
        n.forEach(function (item, index) {
            var it = {}
            dbConnection.query('SELECT * FROM words WHERE id = ?; ', [item], (error, rows) => {
                if (error) throw error;
                for (var data of rows) {
                    it['id'] = data['id']
                    it['video'] = data['video']
                    it['meaning'] = data['meaning']
                }
                todays.push(it)

                if (index === 2) {
                    //console.log(todays)
                    result['todays'] = todays
                    res.status(200).send(result)
                    //console.log(typeof(result))
                }
            })

        });
    })


})
        
    
/**
 * @swagger
 * paths:
 *   /dictionary/search/{meaning}:
 *     get:
 *       summary: "단어 검색 결과 조회"
 *       description: "검색창에 입력된 것에 맞는 단어 뜻을 가진 결과를 모두 보여줌"
 *       parameters:
 *         - in: path
 *           name: meaning
 *           schema: 
 *             type: string
 *           required: true
 *           description: 검색하려는 단어 뜻
 *       tags: [Dictionary]
 *       responses:
 *         "200":
 *            description: 요청 성공
 *            content: 
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 375
 *                      videoLink:
 *                        type: string
 *                        example: 
 *                          "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191004/624375/MOV000254981_700X466.webm"
 *                      meaning: 
 *                        type: string
 *                        example: "어머니, 모친, 어미, 엄마"
 *                      subsection: 
 *                        type: string
 *                        example: "가족 관계 및 행사"
 *                      imageLink:
 *                        type: array
 *                        example: ["http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20230404/1133072/PIC000361272_700X466.jpg"]
 *                      section: 
 *                        type: string
 *                        example: "삶" 
 *                   
 *  
 *           
 * 
 */
//단어 검색 결과
router.get('/search/:meaning', function(req, res, next) {
    param = req.params.meaning

    let func3 = function(id) {
        return new Promise(resolve => {
            dbConnection.query('SELECT * from images where word_id = ?; ',[id], (error, rows) => {
                imageList = [];
                if (error) throw error;

                for (var row of rows) {
                    imageList.push(row['link'])                    
                }
                resolve(imageList)
        })
        })
    }

    let func1 = function() {
        
        console.log("func1 시작")
        var dataList = [];
        return new Promise(resolve => {

            if (req.session.useremail) {

                var ins = [req.session.useremail, req.session.username, param]
                dbConnection.query('SELECT * FROM search_history WHERE user_email = ? AND username = ? AND search = ?;', ins, (err, row) => {
                    if (err) console.log(err)
                    console.log('히스토리')
                    console.log(row)
                    if (Array.isArray(row) && !row.length) {
                        console.log('새로운 단어 입력')
                        dbConnection.query('INSERT INTO search_history(`user_email`, `username`, `search`) VALUES (?, ?, ?)', ins, (err, row) => {
                            if (err) console.log(err)
                            else {
                                console.log('Successfully saved to search history')
                        }
                        })
                    }
                })

            }
            else {
                console.log('No')
            }

            dbConnection.query('SELECT * FROM words WHERE meaning LIKE ? ORDER BY LOCATE(?, meaning); ', ["%" + param + "%", param], (error, rows) => {
                if (error) throw error;
                
                for (var row of rows) {

                    var item = {}
                    item['id'] = row['id']
                    item['videoLink'] = row['video']
                    item['meaning'] = row['meaning']
                    item['section'] = row['section']
                    item['subsection'] = row['subsection']

                    dataList.push(item)
                }

                resolve(dataList);
            })
            
        });
    }


    let test1 = async function() {
        console.log('test 1 시작')
        let dataList = func1()
        console.log('a 출력')
        result = []
        for (var data of await dataList) {

            let images = func3(data['id'])
   
            data['imageLink'] = await images
            
            console.log(data)
            result.push(data)
        }
        res.status(200).send(result)

    }
    (async () => {
        let aa = await test1();
        
    })
    });
    
//검색 결과들 중 하나를 골라서 들어가면 단어 하나에 대한 세부 정보 나타냄
/**
 * @swagger
 * paths:
 *   /dictionary/words/{id}:
 *     get:
 *       summary: "단어 상세 페이지"
 *       description: "하나의 단어에 대한 상세 페이지이다."
 *       parameters:
 *         - in: path
 *           name: id
 *           schema: 
 *             type: integer
 *           required: true
 *           description: 단어의 데이터베이스 상 id
 *       tags: [Dictionary]
 *       responses:
 *         "200":
 *            description: 요청 성공
 *            content: 
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    word: 
 *                      properties:
 *                        id:
 *                          type: integer
 *                          example: 1
 *                        videoLink:
 *                          type: string
 *                          example: "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20160325/269757/MOV000272574_700X466.webm"
 *                        meaning: 
 *                          type: string
 *                          example: "사용자, 소비자, 컨슈머"
 *                        subsection: 
 *                          type: string
 *                          example: "사람의 종류"
 *                        description:
 *                          type: string
 *                          example: "오른손의 1·5지 끝을 맞대어 동그라미를 만들어 끝으로 왼 손바닥을 손목에서 손끝으로 스쳐내는 동작을 두 번 반복한 다음, 두 주먹의 4·5지를 펴서 끝이 위로 향하게 맞대고 세워 양옆으로 두 번 약간 돌리며 벌린다."
 *                        imageLink:
 *                          type: array
 *                          example: ["http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20160325/258541/IMG000272575_700X466.jpg",
 *                                    " http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20160325/258542/IMG000272576_700X466.jpg"]
 *                        section: 
 *                          type: string
 *                          example: "인간"
 *                    word before:
 *                      properties: 
 *                        meaning: 
 *                          type: string
 *                          example: "위인"
 *                        video link: 
 *                          type: string
 *                          example: "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200821/733290/MOV000255759_700X466.webm"
 *                    word after:
 *                      properties: 
 *                        meaning: 
 *                          type: string
 *                          example: "위인"
 *                        video link: 
 *                          type: string
 *                          example: "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200821/733339/MOV000254478_700X466.webm"
 *                     
 *                   
 *  
 *           
 * 
 */
router.get('/words/:id', function(req, res, next) {
    param = req.params.id
    var dataList = [];
    //var result = [];
    var result = {};
    dbConnection.query('SELECT * FROM words WHERE id = ?; ', [param], (error, rows) => {
        if (error) throw error;

        for (var data of rows) {
            var item = {}
            dataList.push(data)
            item['id'] = data['id']
            item['video_link'] = data['video']
            item['meaning'] = data['meaning']
            item['section'] = data['section']
            item['subsection'] = data['subsection']
            item['description'] = data['descr']
            
            //console.log(item)
            imageList = [];
            dbConnection.query('SELECT * from images where word_id = ?; ',[item['id']], (error, rows) => {
                if (error) throw error;
                for (var data of rows) {
                    imageList.push(data['link'])
                    
                }
                item['image_link'] = imageList
                result['word'] = item
                console.log(item)
            })
            
            // dbConnection.query('SELECT * from sections where subsection = ?; ', [item['subsection']] , (error, rows) => {
            //     if (error) throw error;

            //     for (var data of rows) {
            //         item['section'] = data['section']
            //     }
            //     //console.log(item)
            //     //result.push(item)
            //     result["word"] = item
            //     //console.log('1: ', result)
                
            // })

            dbConnection.query('SELECT * FROM words WHERE id = ?; ', [Number(param)-1], (error, rows) => {
                if (error) throw error;
                //console.log(Number(param)-1)
                for (var data of rows) {
                    var item_before = {}
                    item_before['meaning'] = data['meaning']
                    item_before['videoLink'] = data['video']
                    //result.push(item_before)
                    result["word_before"] = item_before
                }
                //console.log(result)
                
            })
            
            dbConnection.query('SELECT * FROM words WHERE id = ?; ', [Number(param)+1], (error, rows) => {
                if (error) throw error;
                //console.log(Number(param)+1)
                for (var data of rows) {
                    var item_after = {}
                    item_after['meaning'] = data['meaning']
                    item_after['videoLink'] = data['video']
                    console.log(item_after)
                    //result.push(item_after)
                    result["word_after"] = item_after
                    console.log(result)
                }
                //console.log(result)
                res.status(200).send(result)
            })
        }
    })
    });




/**
 * @swagger
 * paths:
 *   /dictionary/history:
 *     get:
 *       summary: "GET 검색 기록"
 *       description: "로그인 필요 -> 사용자 이름으로 사전 검색 기록을 가져온다. (먼저 검색한 것 부터)"
 *       tags: [Dictionary]
 *       responses:
 *         "200":
 *            description: 요청 성공
 *            content: 
 *              application/json:
 *                schema:
 *                  type: array
 *                  example: ['안녕', '하늘']
 *         "401":
 *            description: 로그인 안 된 상태여서 불러올 것 없음
 * 
 * 
 */
router.get('/history', function(req, res, next) {
    //username = req.params.username
    if (req.session.useremail) {
        username= req.session.username

        dbConnection.query('SELECT * FROM search_history WHERE username = ?; ', [username], (error, rows) => {
            result = []
            if (error) throw error;
                    
            for (var data of rows) { 
                result.push(data['search'])
            }
            res.status(200).send(result)
        })
    }
    else {
        res.sendStatus(401)
    }
    
 })
/**
 * @swagger
 * paths:
 *   /dictionary/history/{username}/{word}:
 *     post:
 *       summary: "POST 검색 기록 삭제"
 *       description: "로그인 필수 -> 사용자 이름과 단어를 제공하여 검색 기록을 지운다."
 *       parameters:
 *         - in: path
 *           name: word
 *           schema: 
 *             type: string
 *           required: true
 *           description: 지울 검색 기록
 *       tags: [Dictionary]
 *       responses:
 *          
 *         "200":
 *            description: 요청 성공
 *         "401":
 *            description: 로그인 안 된 상태여서 기능 못함
 * 
 * 
 */
 router.post('/history/:word', function(req, res, next) {
    if (req.session.username) {
        username = req.session.username

        word = decodeURI(decodeURIComponent(req.params.word))
        dbConnection.query('DELETE FROM search_history WHERE username = ? AND search = ?; ', [username, word], (error, rows) => {
            if (error) throw error;
        
            res.sendStatus(200)
        })
    }
    else {
        req.sendStatus(401)
    }
    //username = req.params.username
    
 })


 /**
 * @swagger
 * paths:
 *   /dictionary/list?{section}?{pageNo}:
 *     get:
 *       summary: "GET 섹션별 단어"
 *       description: "섹션명으로 해당 단어 목록을 가져온다."
 *       parameters:
 *         - in: query
 *           name: section
 *           schema: 
 *             type: string
 *           required: true
 *           description: 섹션 명
 *         - in: query
 *           name: pageNo
 *           schema: 
 *             type: integer
 *           description: 섹션 페이지 수 (1~)
 *       tags: [Dictionary]
 *       responses:
 *         "200":
 *            description: 요청 성공
 *            content: 
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    no of pages:
 *                      type: integer
 *                      example: 27
 *                    words:
 *                      type: array 
 *                      example: {"video link": "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200820/732677/MOV000257800_700X466.webm","meaning": "중얼거리다"}
 * 
 * 
 */
router.get('/list', function(req, res, next) {
    section = decodeURI(decodeURIComponent(req.query.section))
    pageno = req.query.pageNo
    console.log(section)
    console.log(pageno)
    result = {}
    dbConnection.query('SELECT COUNT(*) FROM words WHERE section = ?; ', [section], (error, rows) => {
        if (error) throw error; 
        count = rows[0]['COUNT(*)']
        //console.log(count%10)
        if (count%10 == 0) {
            result['no_of_pages'] = parseInt(count/10)
        }
        else {
            result['no_of_pages'] = parseInt(count/10) + 1
        }
        //console.log(rows[0]['COUNT(*)'])
        //console.log(result['no of pages'])
    })
    dbConnection.query('SELECT * FROM words WHERE section = ?; ', [section], (error, rows) => {
        words = []
        
        if (error) throw error;
                
        for (var data of rows) { 
            
            item = {}
            item['videoLink'] = data['video']
            item['meaning'] = data['meaning']
            item['section'] = data['section']
            item['id'] = data['id']
            words.push(item)
        }
        result['words'] = words
        result['words'] = words.slice(10 * (pageno-1), 10 * pageno)
        res.status(200).send(result)
    })


 })

 /**
 * @swagger
 * paths:
 *   /dictionary/testlist?{section}?{pageNo}:
 *     get:
 *       summary: "GET 섹션별 단어"
 *       description: "섹션명으로 해당 단어 목록을 가져온다."
 *       parameters:
 *         - in: query
 *           name: section
 *           schema: 
 *             type: string
 *           required: true
 *           description: 섹션 명
 *         - in: query
 *           name: pageNo
 *           schema: 
 *             type: integer
 *           description: 섹션 페이지 수 (1~)
 *       tags: [Dictionary]
 *       responses:
 *         "200":
 *            description: 요청 성공
 *            content: 
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    no of pages:
 *                      type: integer
 *                      example: 27
 *                    words:
 *                      type: array 
 *                      example: {"video link": "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200820/732677/MOV000257800_700X466.webm","meaning": "중얼거리다"}
 * 
 * 
 */
 router.get('/testlist', function(req, res, next) {
    section = decodeURI(decodeURIComponent(req.query.section))
    pageno = req.query.pageNo
    console.log(section)
    console.log(pageno)
    result = {}
    
    dbConnection.query('SELECT * FROM words WHERE section = ?; ', [section], (error, rows) => {
        words = []
        
        if (error) throw error;
                
        for (var data of rows) { 
            
            item = {}
            item['videoLink'] = data['video']
            item['meaning'] = data['meaning']
            item['section'] = data['section']
            item['id'] = data['id']
            words.push(item)
        }
        result['words'] = words
        //result['words'] = words.slice(10 * (pageno-1), 10 * pageno)
        res.status(200).send(result)
    })


 })

module.exports = router;

// post: 검색 기록 db에 검색어 저장 - username으로 검색한 단어 저장
// 검색기록 db에 검색어 삭제 - username과 삭제할 단어 알아내서 db에서 삭제 v
// get: 검색기록 db에 있는 검색어 보여주기 - username으로 검색 단어 v
// section명 누르면 해당 세션의 단어 리스트 보여주기 v
// section - subsection 명 누르면 해당 서브섹션의 단어 리스트 보여주기 
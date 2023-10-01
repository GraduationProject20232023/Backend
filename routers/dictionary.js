var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
var seedrandom = require('seedrandom')
var logger = require('../config/winston');
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Dictionary Index Page: Success!')
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
 *                          {"id": 718,"video": "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20221019/1042464/MOV000360986_700X466.webm","meaning": "주전자"},
 *                          {"id": 1422,"video": "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20221101/1047376/MOV000361247_700X466.webm","meaning": "네덜란드"},
 *                          {"id": 1949,"video": "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191101/633265/MOV000256711_700X466.webm","meaning": "시작, 개시, 개최, 거행, 시발, 착수, 출발, 열다, 이행, 하수"} 
 *                        ]
 *         "500":       
 *           description: MySQL DB 오류. 자세한 오류 내용을 로그 확인
 */
router.get('/main', function (req, res, next) {
    result = {}
    var sections = [];

    const promise1 = new Promise((resolve, reject) => {
        dbConnection.query('SELECT * FROM sections', (error, rows) => {
            if (error) {
                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                logger.log('error', 'DB 오류: sections 테이블에서 섹션 검색하는 것에 실패함. MySQL 에러 => ' + error);
            }
    
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

    logger.log('info', '<=== /dictionary/main 실행 ===>')
    promise1.then((value) => {
        var todays = []
        n.forEach(function (item, index) {
            var it = {}
            dbConnection.query('SELECT * FROM words WHERE id = ?; ', [item], (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', 'DB 오류: word_id로 words 테이블에서 이미지 검색하는 것에 실패함. MySQL 에러 => ' + error);
                }
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
 *                      section: 
 *                        type: string
 *                        example: "삶" 
 *                      subsection: 
 *                        type: string
 *                        example: "가족 관계 및 행사"
 *                      imageLink:
 *                        type: array
 *                        example: ["http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20230404/1133072/PIC000361272_700X466.jpg"]
 *         "404":       
 *           description: 검색 결과 없음.
 *         "500":       
 *           description: MySQL DB 오류. 자세한 오류 내용을 로그 확인
 */
//단어 검색 결과
router.get('/search/:meaning', function(req, res, next) {
    param = req.params.meaning
    

    let func3 = function(id) {
        return new Promise(resolve => {
            dbConnection.query('SELECT * from images where word_id = ?; ',[id], (error, rows) => {
                imageList = [];
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', 'DB 오류: word_id로 images 테이블에서 이미지 검색하는 것에 실패함. MySQL 에러 => ' + error);
                }

                for (var row of rows) {
                    imageList.push(row['link'])                    
                }
                resolve(imageList)
        })
        })
    }

    let func1 = function() {
        
        //console.log("func1 시작")
        logger.log("info", "func1 시작")
        var dataList = [];
        return new Promise(resolve => {

            if (req.session.useremail) {

                var ins = [req.session.useremail, req.session.username, param]
                dbConnection.query('SELECT * FROM search_history WHERE user_email = ? AND username = ? AND search = ?;', ins, (err, row) => {
                    if (err) {
                        res.status(500).send('DB Error: 로그 확인해주세요.'); 
                        logger.log('error', 'DB 오류: search_history 테이블에서 검색기록을 검색하는 것에 실패함. MySQL 에러 => ' + error);
                    }
                    // console.log('히스토리')
                    // console.log(row)
                    if (Array.isArray(row) && !row.length) {
                        logger.log('info', '사용자의 검색기록 리스트에 새로운 단어 입력')
                        dbConnection.query('INSERT INTO search_history(`user_email`, `username`, `search`) VALUES (?, ?, ?)', ins, (err, row) => {
                            if (err) {
                                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                                logger.log('error', 'DB 오류: search_history 테이블에 검색기록을 저장하는 것에 실패함. MySQL 에러 => ' + error);
                            }
                            else {
                                logger.log('info', '사용자의 검색기록 리스트에 새로운 단어 입력 성공!')
                                //console.log('Successfully saved to search history')
                        }
                        })
                    }
                })

            }
            else {
                logger.log('info', '로그인하지 않은 상태여서 검색 기록 저장되지 않음.')
            }

            dbConnection.query('SELECT * FROM words WHERE meaning LIKE ? ORDER BY LOCATE(?, meaning); ', ["%" + param + "%", param], (error, rows) => {
                if (error)  {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', 'DB 오류: words 테이블에서 단어를 검색하는 것에 실패함. MySQL 에러 => ' + error);
                }
                
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
        logger.log('info', '<=== /dictionary/search/'+param+' 실행 ===>')
        //console.log('test 1 시작')
        let dataList = func1()
        //console.log('a 출력')
        result = []
        for (var data of await dataList) {

            let images = func3(data['id'])
   
            data['imageLink'] = await images
            
            //console.log(data)
            result.push(data)
        }
        
        if (! result.length) {
            res.status(404).send('검색 결과 없음!')
        }
        else {
            res.status(200).send(result)
        }
        
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
 *                        section: 
 *                          type: string
 *                          example: "인간"
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
 *         "404":       
 *           description: 입력된 단어 id에 해당하는 단어가 DB에 없음. id 범주에 맞지 않는 숫자가 입력됨.
 *         "500":       
 *           description: MySQL DB 오류. 자세한 오류 내용을 로그 확인
 */
router.get('/words/:id', function(req, res, next) {

    param = req.params.id
    logger.log('info', '<=== /dictionary/words/?'+param+' 실행 ===>')
    var dataList = [];
    //var result = [];
    var result = {};
    dbConnection.query('SELECT * FROM words WHERE id = ?; ', [param], (error, rows) => {
        if (error) {
            res.status(500).send('DB Error: 로그 확인해주세요.'); 
            logger.log('error', 'DB 오류: word_id로 words(단어) 테이블에서 단어 검색하는 것에 실패함. MySQL 에러 => ' + error);
        }
        if (!rows) {
            res.status(404).send('입력된 단어 id에 해당하는 단어가 DB에 없음! id 범주에 맞지 않는 숫자가 입력됨.')
        }
        for (var data of rows) {
            var item = {}
            dataList.push(data)
            item['id'] = data['id']
            item['video_link'] = data['video']
            item['meaning'] = data['meaning']
            item['section'] = data['section']
            item['subsection'] = data['subsection']
            item['description'] = data['descr']
            

            imageList = [];
            dbConnection.query('SELECT * from images where word_id = ?; ',[item['id']], (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', 'DB 오류: word_id로 images(수형사진) 테이블에서 이미지 검색하는 것에 실패함. MySQL 에러 => ' + error);
                }
                for (var data of rows) {
                    imageList.push(data['link'])
                    
                }
                item['image_link'] = imageList
                result['word'] = item
                console.log(item)
            })
            

            dbConnection.query('SELECT * FROM words WHERE id = ?; ', [Number(param)-1], (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', 'DB 오류: words 테이블에서 이전 단어 불러오기 실패함. MySQL 에러 => ' + error);
                }

                for (var data of rows) {
                    var item_before = {}
                    item_before['meaning'] = data['meaning']
                    item_before['videoLink'] = data['video']
                    //result.push(item_before)
                    result["word_before"] = item_before
                }

            })
            
            dbConnection.query('SELECT * FROM words WHERE id = ?; ', [Number(param)+1], (error, rows) => {
                if (error) {
                    res.status(500).send('DB Error: 로그 확인해주세요.'); 
                    logger.log('error', 'DB 오류: words 테이블에서 이후 단어 불러오기 실패함. MySQL 에러 => ' + error);
                }
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
                res.status(200).send(result)
            })
        }
    })
    });



 /**
 * @swagger
 * paths:
 *   /dictionary/list?{section}&{pageNo}:
 *     get:
 *       summary: "섹션별 단어 목록"
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
 *                      example: [{"videoLink": "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200821/733290/MOV000255759_700X466.webm","meaning": "위인","section": "인간","id": 0},]
 * 
 *         "400":
 *           description: 잘못된 섹션명. 해당 섹션명은 존재하지 않음
 *         "500":       
 *           description: MySQL DB 오류. 자세한 오류 내용을 로그 확인
 */
router.get('/list', function(req, res, next) {

    section = decodeURI(decodeURIComponent(req.query.section))
    pageno = req.query.pageNo
    logger.log('info', '<=== /dictionary/list?'+section+'&'+pageno+' 실행 ===>')
    //console.log(section)
    //console.log(pageno)
    result = {}
    dbConnection.query('SELECT COUNT(*) FROM words WHERE section = ?; ', [section], (error, rows) => {
        if (error) {
            res.status(500).send('DB Error: 로그 확인해주세요.'); 
            logger.log('error', 'DB 오류: words 테이블에서 이후 단어 불러오기 실패함1. MySQL 에러 => ' + error);
        }
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
        
        if (error) {
            res.status(500).send('DB Error: 로그 확인해주세요.'); 
            logger.log('error', 'DB 오류: words 테이블에서 이후 단어 불러오기 실패함2. MySQL 에러 => ' + error);
        }
                
        for (var data of rows) { 
            
            item = {}
            item['videoLink'] = data['video']
            item['meaning'] = data['meaning']
            item['section'] = data['section']
            item['id'] = data['id']
            words.push(item)
        }
        result['words'] = words
        if (! result['words'].length) {
            res.status(400).send('잘못된 섹션명: 해당 섹션명은 존재하지 않음')
            logger.log('error', '잘못된 섹션명: 해당 섹션명은 존재하지 않음.')
        }
        result['words'] = words.slice(10 * (pageno-1), 10 * pageno)
        res.status(200).send(result)
    })


 })

 /**
 * @swagger
 * paths:
 *   /dictionary/testlist?{section}:
 *     get:
 *       summary: "섹션별 전체 단어 목록"
 *       description: "섹션명으로 해당 단어 목록을 가져온다."
 *       parameters:
 *         - in: query
 *           name: section
 *           schema: 
 *             type: string
 *           required: true
 *           description: 섹션 명
 *       tags: [Dictionary]
 *       responses:
 *         "200":
 *            description: 요청 성공
 *            content: 
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    words:
 *                      type: array 
 *                      example: [{"videoLink": "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200821/733290/MOV000255759_700X466.webm","meaning": "위인","section": "인간","id": 0},]
 *         "400":
 *           description: 잘못된 섹션명. 해당 섹션명은 존재하지 않음!
 *         "500":       
 *           description: MySQL DB 오류. 자세한 오류 내용을 로그 확인
 */
 router.get('/testlist', function(req, res, next) {
    section = decodeURI(decodeURIComponent(req.query.section))
    //pageno = req.query.pageNo
    //console.log(section)
    logger.log('info', '<=== /dictionary/testlist?'+section+' 실행 ===>')
    //console.log(pageno)
    result = {}
    
    dbConnection.query('SELECT * FROM words WHERE section = ?; ', [section], (error, rows) => {
        words = []
        
        if (error) {
            res.status(500).send('DB Error: 로그 확인해주세요.'); 
            logger.log('error', 'DB 오류: words 테이블에서 이후 단어 불러오기 실패함. MySQL 에러 => ' + error);
        }
        
        for (var data of rows) { 
            
            item = {}
            item['videoLink'] = data['video']
            item['meaning'] = data['meaning']
            item['section'] = data['section']
            item['id'] = data['id']
            words.push(item)
        }
        result['words'] = words
        //console.log(result['words'].length)
        if (! result['words'].length) {
            res.status(400).send('잘못된 섹션명: 해당 섹션명은 존재하지 않음!')
            logger.log('error', '잘못된 섹션명: 해당 섹션명은 존재하지 않음.')
        }
        else {
            res.status(200).send(result)
        }
        
        //result['words'] = words.slice(10 * (pageno-1), 10 * pageno)
        
    })


 })


/**
 * @swagger
 * paths:
 *   /dictionary/history:
 *     get:
 *       summary: "사용자의 검색 기록"
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
 *            description: 로그인 상태가 아님
 *         "500":       
 *            description: 내부 서버 오류. DB오류이거나 brypt 해시 오류-> 자세한 오류 내용을 로그 확인
 */
router.get('/history', function(req, res, next) {
    //username = req.params.username
    if (req.session.useremail) {
        username= req.session.username

        dbConnection.query('SELECT * FROM search_history WHERE username = ?; ', [username], (error, rows) => {
            result = []
            if (error) {
                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                logger.log('error', err);
            }
                    
            for (var data of rows) { 
                result.push(data['search'])
            }
            res.status(200).send(result)
            logger.log('검색 결과 가져오기 성공!')
        })
    }
    else {
        res.status(401).send('로그인 상태가 아님!')
        logger.log('error', '로그인 상태가 아님.')
    }
    
 })
/**
 * @swagger
 * paths:
 *   /dictionary/history/{word}:
 *     post:
 *       summary: "사용자의 검색 기록 삭제"
 *       description: "로그인 필요 -> 사용자 이름과 단어를 제공하여 검색 기록을 지운다."
 *       parameters:
 *         - in: path
 *           name: word
 *           schema: 
 *             type: string
 *           required: true
 *           description: 지울 검색 기록 단어
 *       tags: [Dictionary]
 *       responses:
 *          
 *         "200":
 *            description: 요청 성공
 *         "401":
 *            description: 로그인 상태가 아님.
 *         "500":       
 *            description: 내부 서버 오류. DB오류이거나 brypt 해시 오류-> 자세한 오류 내용을 로그 확인해주세요.
 */
 router.post('/history/:word', function(req, res, next) {
    if (req.session.username) {
        username = req.session.username

        word = decodeURI(decodeURIComponent(req.params.word))
        dbConnection.query('DELETE FROM search_history WHERE username = ? AND search = ?; ', [username, word], (error, rows) => {
            if (error) {
                res.status(500).send('DB Error: 로그 확인해주세요.'); 
                logger.log('error', err);
            }
        
            res.status(200).send('검색 결과 지우기 성공!')
            logger.log('info', '검색 결과 지우기 성공!')
        })
    }
    else {
        res.status(401).send('로그인 상태가 아님!')
        logger.log('error', '로그인 상태가 아님.')
    }
    //username = req.params.username
    
 })


module.exports = router;

// post: 검색 기록 db에 검색어 저장 - username으로 검색한 단어 저장
// 검색기록 db에 검색어 삭제 - username과 삭제할 단어 알아내서 db에서 삭제 v
// get: 검색기록 db에 있는 검색어 보여주기 - username으로 검색 단어 v
// section명 누르면 해당 세션의 단어 리스트 보여주기 v
// section - subsection 명 누르면 해당 서브섹션의 단어 리스트 보여주기 
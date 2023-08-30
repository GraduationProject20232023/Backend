var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');


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

    var n = []
    for (var i = 0; i < 3; i ++) {
        var num = getRndInteger(0, 3669)
        if (n.includes(num) === false) {
            n.push(num)
        }
    }

    promise1.then((value) => {
        todays = []
        n.forEach(function (item, index) {
            var it = {}
            dbConnection.query('SELECT * FROM words WHERE id = ?; ', [item], (error, rows) => {
                if (error) throw error;
                for (var data of rows) {
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
    var dataList = [];
    var result = [];
    dbConnection.query('SELECT * FROM words WHERE meaning LIKE ?; ', ["%" + param + "%"], (error, rows) => {
        if (error) throw error;

        for (var data of rows) {
            var item = {}
            dataList.push(data)
            item['id'] = data['id']
            item['videoLink'] = data['video']
            item['meaning'] = data['meaning']
            item['subsection'] = data['subsection']
            //console.log(item)
            imageList = [];
            dbConnection.query('SELECT * from images where word_id = ?; ',[item['id']], (error, rows) => {
                if (error) throw error;
                for (var data of rows) {
                    imageList.push(data['link'])
                    
                }
                item['imageLink'] = imageList
                //console.log(item)
            })
            
            dbConnection.query('SELECT * from sections where subsection = ?; ', [item['subsection']] , (error, rows) => {
                if (error) throw error;

                for (var data of rows) {
                    item['section'] = data['section']
                }
                //console.log(item)
                result.push(item)
                console.log('1: ', result)
                res.status(200).send(result)
            })
        }
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
            item['video link'] = data['video']
            item['meaning'] = data['meaning']
            item['subsection'] = data['subsection']
            item['description'] = data['descr']
            //console.log(item)
            imageList = [];
            dbConnection.query('SELECT * from images where word_id = ?; ',[item['id']], (error, rows) => {
                if (error) throw error;
                for (var data of rows) {
                    imageList.push(data['link'])
                    
                }
                item['image link'] = imageList
                //console.log(item)
            })
            
            dbConnection.query('SELECT * from sections where subsection = ?; ', [item['subsection']] , (error, rows) => {
                if (error) throw error;

                for (var data of rows) {
                    item['section'] = data['section']
                }
                //console.log(item)
                //result.push(item)
                result["word"] = item
                //console.log('1: ', result)
                
            })

            dbConnection.query('SELECT * FROM words WHERE id = ?; ', [Number(param)-1], (error, rows) => {
                if (error) throw error;
                //console.log(Number(param)-1)
                for (var data of rows) {
                    var item_before = {}
                    item_before['meaning'] = data['meaning']
                    item_before['videoLink'] = data['video']
                    //result.push(item_before)
                    result["word before"] = item_before
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
                    result["word after"] = item_after
                    console.log(result)
                }
                //console.log(result)
                res.status(200).send(result)
            })
        }
    })
    });

module.exports = router;
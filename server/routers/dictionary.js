var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');


/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Index Page: Success!')
});

router.get('/main', function (req, res, next) {
    
})
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
                res.send(result)
            })
        }
    })
    });
    
//검색 결과들 중 하나를 골라서 들어가면 단어 하나에 대한 세부 정보 나타냄
router.get('/words/:id', function(req, res, next) {
    param = req.params.id
    var dataList = [];
    var result = [];
    dbConnection.query('SELECT * FROM words WHERE id = ?; ', [param], (error, rows) => {
        if (error) throw error;

        for (var data of rows) {
            var item = {}
            dataList.push(data)
            item['id'] = data['id']
            item['videoLink'] = data['video']
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
                //console.log('1: ', result)
                
            })

            dbConnection.query('SELECT * FROM words WHERE id = ?; ', [Number(param)-1], (error, rows) => {
                if (error) throw error;
                //console.log(Number(param)-1)
                for (var data of rows) {
                    var item_before = {}
                    item_before['meaning'] = data['meaning']
                    item_before['videoLink'] = data['video']
                    result.push(item_before)
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
                    result.push(item_after)
                    
                    console.log(result)
                }
                //console.log(result)
                res.send(result)
            })
        }
    })
    });
// app.get('/dictionary/words/:id', (req, res) => {
//     id = req.params.id
//     var dataList = [];
//     connection.query('SELECT * from words where id = ?; ', [id], (error, rows) => {
//       if (error) throw error;
//       for (var data of rows) {
//         dataList.push(data)
//       }
//       connection.query('SELECT * from images where word_id = ?; ', [id], (error, rows2) => {
//         if (error) throw error;
  
//         for (var data2 of rows2) {
//           dataList.push(data2)
//         }
  
//       })
//       connection.query('SELECT * from sections where subsection = ?; ', [dataList[0]['subsection']], (error, rows3)  => {
//         if (error) throw error;
//         for (var data3 of rows3) {
//           //console.log(dataList[0]['subsection'])
//           dataList.push(data3)
//           res.send(dataList)
//         console.log(dataList)
//         }
//       })
      
//     })
//   });
module.exports = router;
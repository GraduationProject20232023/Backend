const express    = require('express');
const mysql      = require('mysql');
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);
var cors = require('cors')
const axios = require('axios');
const app = express();


app.use(cors())
 
// configuration =========================
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('Root');
});

app.get('/words/:mean', (req, res) => {

    const paramDecoded = decodeURIComponent(req.params.mean)
    var query = "%"+ paramDecoded +"%"

    connection.query('SELECT * from words where kor_mean LIKE ?; ', [query], (error, rows) => {
    if (error) throw error;
    var dataList = [];
    for (var data of rows) {
        dataList.push(data)
    }
    console.log(dataList);
   // var word_id = rows[0].word_id
    res.send(rows);


    
  });
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});


// 동영상 플레이 버튼 만들기
// img table에서 img 가져와서 보이기
// section table에서 section 가져와서 보이기
// --> multiple requests 를 res.write로 보내서 어떻게 fetch로 request 여러개 받는지 알아내야 함.
// 이거는 프론트아닌가..?
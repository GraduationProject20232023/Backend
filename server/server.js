const express = require('express');
const dbConnection = require('./config/database.js');
const app = express();
var cors = require('cors')

const session = require('express-session')
const cookieParser = require('cookie-parser')

app.use(cors({
  origin : true,
  credentials : true
}))
app.use(cookieParser())
app.use(session({
  key: "loginData", 
  secret: "testSecret", 
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60* 60* 24,
  }
}))
// Routers
var usersRouter = require('./routers/user.js');
var indexRouter = require('./routers/index.js');

app.use('/', indexRouter);
app.use('/user', usersRouter);


// Database Connection
//var conn = dbConfig.init();
//dbConfig.connect(conn);


//const connection = mysql.createConnection(dbconfig);
const axios = require('axios');




// configuration =========================
app.set('port', process.env.PORT || 3000);

//app.get('/', (req, res) => {
//  res.send('Root');
//});
//단어 검색
app.get('/dictionary/search/:meaning', (req, res) => {
  //const paramDecoded = decodeURIComponent(req.params.meaning)
  //var query = "%"+ paramDecoded +"%"
  var dataList = [];
  dbConnection.query('SELECT * from words where meaning LIKE ?; ', ["%" + req.params.meaning + "%"], (error, rows) => {
    if (error) throw error;

    for (var data of rows) {
      dataList.push(data)
    }
    console.log(dataList);
    res.send(dataList);
  })
});

//검색 결과들 중 하나를 골라서 들어가면 단어 하나에 대한 세부 정보 나타냄
app.get('/dictionary/words/:id', (req, res) => {
  id = req.params.id
  var dataList = [];
  connection.query('SELECT * from words where id = ?; ', [id], (error, rows) => {
    if (error) throw error;
    for (var data of rows) {
      dataList.push(data)
    }
    connection.query('SELECT * from images where word_id = ?; ', [id], (error, rows2) => {
      if (error) throw error;

      for (var data2 of rows2) {
        dataList.push(data2)
      }

    })
    connection.query('SELECT * from sections where subsection = ?; ', [dataList[0]['subsection']], (error, rows3)  => {
      if (error) throw error;
      for (var data3 of rows3) {
        //console.log(dataList[0]['subsection'])
        dataList.push(data3)
        res.send(dataList)
      console.log(dataList)
      }
    })
    
  })
});
  
//게시판(boards)
// list all the boards
app.get('/boards/list', (req, res) => {
  connection.query('SELECT * FROM boards', (error, result) => {
    if (error) return console.log(error);
    //if (result) res.render('boards.html', {boardList: result})

    console.log(result);
    res.send(result);
  });
});


app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});

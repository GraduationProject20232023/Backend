const express = require('express');
const dbConnection = require('./config/database');
const app = express();
var cors = require('cors');
const session = require('express-session');
//const log4js = require("log4js");
//import { logger } from './config/winston';
var logger = require('./config/winston');
const axios = require('axios');
const fs = require("fs");

//const session = require('express-session')
//const cookieParser = require('cookie-parser')

app.use(cors({
  origin : true,
  credentials : true
}))

app.use(session({
  secret:'oh',
  resave: false,
  saveUninitialized: true
}))
app.use(express.json())
//app.use(cookieParser())
// app.use(session({
//   key: "loginData", 
//   secret: "testSecret", 
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     expires: 60* 60* 24,
//   }
// }))
// Routers
var usersRouter = require('./routers/user.js');
var indexRouter = require('./routers/index.js');
var dictionaryRouter = require('./routers/dictionary.js');
var boardRouter = require('./routers/board.js')
var noteRouter = require('./routers/note.js')
var friendRouter = require('./routers/friend.js')
var logRouter = require('./routers/logs')
var mypageRouter = require('./routers/mypage')
var gameRouter = require('./routers/game')
var aiRouter = require('./routers/ai.js')
app.use('/', indexRouter);
/**
 * @swagger
 * tags: User
 * description: 사용자 회원가입/로그인/로그아웃
 */
app.use('/users', usersRouter);
/**
 * @swagger
 * tags: Dictionary
 * description: 사전
 */
app.use('/dictionary', dictionaryRouter);
/**
 * @swagger
 * tags: Community
 * description: 게시판
 */
app.use('/boards', boardRouter);
/**
 * @swagger
 * tags: Note
 * description: 단어장
 */
app.use('/notes', noteRouter);
/**
 * @swagger
 * tags: Friend
 * description: 친구관리
 */
app.use('/friends', friendRouter);

app.use('/logs', logRouter);

app.use('/mypage', mypageRouter);

/**
 * @swagger
 * tags: Game
 * description: 수화 맞추기 게임
 */
app.use('/games', gameRouter);

// // Start the server
// app.listen(3000, () => {
//     console.log("Server started on port 3000");
// });

app.use('/ai', aiRouter)

console.log(Date.now())












// Database Connection
//var conn = dbConfig.init();
//dbConfig.connect(conn);

// app.get('/login', (req, res) => {
//   var session = req.session;
//   session.userId = 'test'
//   session.userPw = '1234'
//   res.json(req.session)
// })

// app.get('/home', (req, res) => {
//   var session = req.session;

//   res.json({
//     userId: session.userId,
//     userPw: session.userPw
//   })
// })

// app.get('/delete', (req, res) => {
//   req.session.destroy(function(err) {
//     if (err) {
//       res.end(err);
//     }
//     res.json({
//       'message': "success delete"
//     })
//   })
// })
//const connection = mysql.createConnection(dbconfig);





// configuration =========================
app.set('port', process.env.PORT || 3000);

//app.get('/', (req, res) => {
//  res.send('Root');
//});
const {swaggerUi, specs} = require("./swagger/swagger.js")
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

// //검색 결과들 중 하나를 골라서 들어가면 단어 하나에 대한 세부 정보 나타냄
// app.get('/dictionary/words/:id', (req, res) => {
//   id = req.params.id
//   var dataList = [];
//   connection.query('SELECT * from words where id = ?; ', [id], (error, rows) => {
//     if (error) throw error;
//     for (var data of rows) {
//       dataList.push(data)
//     }
//     connection.query('SELECT * from images where word_id = ?; ', [id], (error, rows2) => {
//       if (error) throw error;

//       for (var data2 of rows2) {
//         dataList.push(data2)
//       }

//     })
//     connection.query('SELECT * from sections where subsection = ?; ', [dataList[0]['subsection']], (error, rows3)  => {
//       if (error) throw error;
//       for (var data3 of rows3) {
//         //console.log(dataList[0]['subsection'])
//         dataList.push(data3)
//         res.send(dataList)
//       console.log(dataList)
//       }
//     })
    
//   })
// });
  
// //게시판(boards)
// // list all the boards
// app.get('/boards/list', (req, res) => {
//   connection.query('SELECT * FROM boards', (error, result) => {                                                                                                                                                                                                                                                            
//     if (error) return console.log(error);
//     //if (result) res.render('boards.html', {boardList: result})

//     console.log(result);
//     res.send(result);
//   });
// });                              
app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
  logger.info('Server listening from port 3000');
});



// {
//   "isSuccess": true,
//   "message": "반환한 response 설명"
//   "data": [
//     {
//       "game_id": 1,
//       "played_at": "2023-09-12 11:17:51",
//       "total_score": 80,
//       "game_category": "주생활"
//     }, 
//     {
//       "game_id": 1,
//       "played_at": "2023-09-12 11:17:51",
//       "total_score": 80,
//       "game_category": "주생활"
//     },
//   ]
// }

// {
//   "isSuccess": true,
//   "message": "빈 리스트"
//   "data": []
// }


// {
//   "isSuccess": false,
//   "message": "에러 메세지 설명"
//   "data": []
// }
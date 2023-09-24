var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
//var seedrandom = require('seedrandom')

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Index Page: Success!')
});

// 친구 목록 api
// 추천 단어 3개 
// 단어장 목록 api
// 단어장 세부 api
// 단어장 추가 api
// 단어장에 단어 저장 api
// 단어장에서 단어 삭제 api
 
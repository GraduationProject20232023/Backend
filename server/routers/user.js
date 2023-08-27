dbConnection = require('../config/database.js');
var express = require('express');
var router = express.Router();
//var bcrypt = require('bcrypt');
const saltRounds = 10;


/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Index Page: Success!')
});



// Register
router.post('/register', (req, res, next) => {
    const param = [req.body.email, req.body.pw, req.body.username]
    
    dbConnection.query("SELECT * FROM users WHERE user_email ='"+param[0]+ "';", (err, rows) => {
        if (err) console.log(err);
        else if (rows.length == 0) { //같은 eamil이 없는 경우
            dbConnection.query("SELECT * FROM users WHERE username = '"+param[2]+"';", (err, rows) => {
                if (rows.length == 0) { // 같은 username 없는 경우
                    bcrypt.hash(param[1], saltRounds, (error, hash) => {
                        param[1] = hash
                        dbConnection.query('INSERT INTO users(`user_email`, `password_`, `username`) VALUES (?, ?, ?)', param, (err, row) => {
                            if(err) console.log(err)
                            else res.status(201).send('Successfully created the account.') // 계정 생성함
                        }
                        )
                    })
                }
                else { //같은 username 있는 경우
                    res.status(400).send('This username already exists.') 
                }
            });
        }
        else {
            //이미 같은 email 사용자 존재함
            res.status(400).send('This email already exists.')
        }
    });
    res.end()
})

// Login
router.post("/login", (req, res) => {
    console.log("로그인 함수 실행")

    const param = [req.body.email, req.body.pw]

    if (req.session.user) {
        // if the session is ongoing, destroy the session
        req.session.destroy(error => {if(error) console.log(error)})
    }
    dbConnection.query('SELECT * FROM users WHERE user_email = ?', param[0], (err, row) => {
        if(err) console.log(err)
        if(row.length >0) {
            bcrypt.compare(param[1], row[0].password_, (error, result) => {
                if (result) { // 성공
                    req.session.loginData = 
                    req.session.save(error => {if(error) console.log(error)})

                }
                else { // 실패

                }
            }) 
        }
        else {
            console.log('ID가 존재하지 않습니다. ')
        }

    })

    res.end()
})

// // Logout
// router.post('/logout', (req, res)=> {
//     if (){ //세션 정보가 있을 때) 
//         req.session.destroy(error => {if(error) console.log(error)})
//     }
//     else {

//     }
// })

module.exports = router;
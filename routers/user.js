dbConnection = require('../config/database.js');
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;


/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Index Page: Success!')
    console.log(req.session.cookie)
    console.log(req.session.user)
});



// Register
router.post('/register', (req, res, next) => {
    console.log(req.body)
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
                            else {
                                return res.status(201).send('Successfully created the account.') // 계정 생성함
                                
                            }
                        }
                        )
                    })
                }
                else { //같은 username 있는 경우
                    return res.status(400).send('This username already exists.') 
                    
                }
            });
        }
        else {
            //이미 같은 email 사용자 존재함
            return res.status(400).send('This email already exists.')
            
        }
    });
    //res.end()
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
                    console.log('로그인 성공')
                    useremail = row[0]['user_email']
                    username = row[0]['username']
                    req.session.useremail = useremail
                    req.session.username = username
                    console.log(req.session.cookie)
                    req.session.save(error => {if(error) console.log(error)})
                    res.status(400).send({
                        'useremail': useremail,
                        'username': username
                    })
                }
                else { // 실패
                    console.log('비밀번호 실패')
                    res.sendStatus(401)
                }
            }) 
        }
        else {
            console.log('email이 존재하지 않습니다. ')
            res.sendStatus(402)
        }

    })

    //res.end()
})

 // Logout
 router.post('/logout', (req, res)=> {
     if (req.session.user){ //세션 정보가 있을 때) 
        req.session.destroy(error => {if(error) console.log(error)})
        console.log('로그아웃 성공')
     }
     else {
        console.log('로그아웃 실패')
     }
 })

module.exports = router;
dbConnection.query('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC', post_id, (error, rows) => {
    if (error) {
        res.status(500).send('DB Error: 로그 확인해주세요.'); 
        logger.log('error', error);
    }
    else {
        comments = []
        console.log('promise2 시작')
        for (var data3 of rows) {
            comment = {}
            var writer = ''
            dbConnection.query('SELECT username FROM users WHERE user_email = ?', data3['user_email'], (error, rows) => {
            if (error) console.log(error)
            else {
                writer = rows[0]['username']
                comment['writer'] = writer
                comment['comment_id'] = data3['comment_id']
                comment['body'] = data3['body']
                comment['created_at'] = JSON.stringify(data3['created_at']).replace(/"/, '').replace(/T/, ' ').replace(/\..+/, '')
                comments.push(comment)
                console.log('then')
                console.log(comments)
                result['comments'] = comments
                
            }
        }) 
    }
    res.status(200).send(result)
}
})








dbConnection.query('UPDATE posts SET views = views + 1 WHERE post_id = ?', data['post_id'], (error, rows) => {
    if (error) {
        res.status(500).send('DB Error: 로그 확인해주세요.'); 
        logger.log('error', error);
    }
    else {
        logger.log('info', '게시글 조회수 +1 성공!')
    }
})



dbConnection.query('SELECT * FROM posts WHERE post_id = ?', post_id, (error, rows) => {
    if (error) {
        res.status(500).send('DB Error: 로그 확인해주세요.'); 
        logger.log('error', error);
    }
    else {
        if (! rows.length) {
            res.status(404).send('입력된 post_id(게시글 번호를) 가진 게시글이 존재하지 않음.')
        }
        else {
            for (var data of rows) {
                result = {}
                var user_email = data['user_email']

                    dbConnection.query('SELECT * FROM users WHERE user_email = ?', user_email, (error, rows) => {
                        if (error) {
                            res.status(500).send('DB Error: 로그 확인해주세요.'); 
                            logger.log('error', error);
                        }
                        else {
                            for (var data2 of rows) {
                                result['writer'] = data2['username']
                            }
                        }
                    })
                    result['post_id'] = data['post_id']
                    result['board_name'] = data['board_name']
                    result['title'] = data['title']
                    result['body'] = data['body']
                    result['views'] = data['views']
                    result['created_at'] = JSON.stringify(data['created_at']).replace(/"/, '').replace(/T/, ' ').replace(/\..+/, '')
            }
        } 
    } 
})
//module.exports = {
  //  host     : 'localhost',
  //  user     : 'root',
  //  password : 'alswl1503',
  //  database : 'handy2',
  //  multipleStatements: true
  //};
var mysql = require('mysql');

// Database Info
var dbInfo = {
  host     : 'handy.cexohtfsyd3z.ap-northeast-2.rds.amazonaws.com',
  user     : 'admin',
  password : 'gosel2023',
  database : 'handy',
  multipleStatements: true
}

// Create connection
function connection() {
  const db = mysql.createConnection(dbInfo);

  db.connect(function (err) {
    if (!err) {
      console.log('Database is connected!');
    } else {
      console.log('Error connecting database!');
    }
  });

  return db;
}

module.exports = connection();
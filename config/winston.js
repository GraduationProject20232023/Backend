//import winston from 'winston';
const winston = require('winston');
//const winstonDaily = require('winston-daily-rotate-file');
//import winstonDaily from 'winston-daily-rotate-file';

const logDir ='logs'; // logs 디렉토리 하위에 로그 파일 저장
const {combine, timestamp, printf} = winston.format;

// Define log format
const logFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  });

  /*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      logFormat,
    ),
    transports: [
        new winston.transports.File(
            {
                filename: 'combined_local.log',
                dirname: logDir,
                datePattern: 'YYYY-MM-DD',
                level: 'info'
            }
        )],
  });


  // Production 환경이 아닌 경우(dev 등) 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),  // 색깔 넣어서 출력
        winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
      )
    }));
  }
  
  //export { logger };
  module.exports = logger;
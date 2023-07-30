const winston = require('winston');
require('winston-daily-rotate-file');

class Logger {
  constructor() {
    const options = {
      file: {
        level: 'info',
        filename: 'logs/daily-log-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d',
        zippedArchive: true,
        maxSize: '20m',
        auditFile: 'logs/logger-audit.json',
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf((info) => {
            if (info.context instanceof Error) {
              const errData = {
                message: info.context.message,
                stack: info.context.stack,
              };
              return `[${info.level}] ${info.timestamp} ${info.message} - ${JSON.stringify(
                errData ? errData : ''
              )}`;
            }
            return `[${info.level}] ${info.timestamp} ${info.message} ${JSON.stringify(
              info.context ? info.context : ''
            )}`;
          })
        ),
      },
      console: {
        level: 'info',
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf((info) => {
            if (info.context instanceof Error) {
              const errData = {
                message: info.context.message,
                stack: info.context.stack,
              };
              return `[${info.level}] ${info.timestamp} ${info.message} - ${JSON.stringify(
                errData ? errData : ''
              )}`;
            }
            return `[${info.level}] ${info.timestamp} ${info.message} ${JSON.stringify(
              info.context ? info.context : ''
            )}`;
          })
        ),
      },
    };

    this.logger = winston.createLogger({
      // levels: winston.config.syslog.levels,
      transports: [
        new winston.transports.DailyRotateFile(options.file),
        new winston.transports.Console(options.console),
      ],
    });
  }

}

module.exports = new Logger();

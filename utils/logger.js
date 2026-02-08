import winston from 'winston';

/* error level
{
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}
*/

const myFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
);

// In serverless environments (like Vercel), file system is read-only
// Only use Console transport
const isServerless = process.env.VERCEL === '1' || process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

const transports = [
  new winston.transports.Console({
    // color format must at first
    format: winston.format.combine(winston.format.colorize(), myFormat),
  }),
];

// Only add file transports in non-serverless environments
if (!isServerless) {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', format: myFormat }),
    new winston.transports.File({ filename: 'logs/combined.log', level: 'info', format: myFormat })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports,
});

export default logger;

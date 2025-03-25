const { log } = require('console');
const { format } = require('date-fns');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logeDate = format(new Date(), 'yyyyMMdd')) => {
    const Time = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`;
    const logItem = `${Time}\t${message}\n`;
    
    try {
        if (!fs.existsSync(path.join(__dirname, 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, 'logs'));
        }

        await fsPromises.appendFile(path.join(__dirname, 'logs', logeDate + '.log'), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = (req,res,next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`);
    next();
}

module.exports = {logEvents,logger};
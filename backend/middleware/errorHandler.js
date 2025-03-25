const {logEvents} = require('./log');
const errorHandler = (err,req,res,next) => {
    logEvents(`${err.name}\t${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,'errLog');
    console.log(err.stack);
    res.status(500).send(err.message);
    next();
}

module.exports = errorHandler;
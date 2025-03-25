const {pool} = require('../database/connect');
const jwt = require('jsonwebtoken');

const test = async (req, res) => {
    res.json("ok");
}

module.exports = {test};
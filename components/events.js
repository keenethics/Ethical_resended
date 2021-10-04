const axios = require('axios');
const keyset = require('../constants.json');
const db = require('./db');
let router = require('express').Router();

router.post('/', (req, res, next) => {
    try {
        let body = {challenge: req.body.challenge}
        console.log(body);
        res.type('application/x-www-form-urlencoded');
        res.send(body);
        res.end();
    } catch (error) {
        console.log(error);
    }
})

module.exports.eventRouter = router;
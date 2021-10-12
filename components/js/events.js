let router = require('express').Router();

// Now, this module just answers slack API challenge (means useless, but may be used later)
router.post('/', (req, res, next) => {
    try {
        let body = {challenge: req.body.challenge};
        console.log(body);
        res.type('application/x-www-form-urlencoded');
        res.send(body);
        res.end();
    } catch (error) {
        console.log(error);
    }
});

module.exports.eventRouter = router;
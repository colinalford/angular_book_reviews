var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    res.sendFile(path.join(__dirname, '../public/ng/book_app/index.html'));
});

router.get('/try', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credential', true);
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Requested-With, Accept, Cache-Control');
    console.log(res.header.toSource());
    res.render('layout.hbs', {title: 'Fuck my life'});
});

module.exports = router;

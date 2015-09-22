var express = require('express');
var path = require('path');
var router = express.Router();
var ToRead = require('../models/toread');
var Reviewed = require('../models/reviewed');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public/ng/book_app/index.html'));
});

router.get('/api/toread', function(req, res) {
    ToRead.find(function(err, data) {
        if (err) {
            res.json('Error: '+err);
        } else {
            res.json(data);
        }
    });
});

router.post('/api/toread', function(req, res) {
    var toread = new ToRead();
    toread.isbn = req.body.isbn;
    toread.title = req.body.title;
    toread.author = req.body.author;
    toread.year_published = req.body.year_published;
    toread.began_date = req.body.began_date;
    toread.notes = req.body.notes;
    toread.img_url = req.body.img;

    toread.save(function(err) {
        if (err) {
            res.json('Error: '+err);
        } else {
            res.json('Successfully Added');
        }
    });
});

router.get('/api/toread/:isbn', function(req, res) {
    ToRead.findOne({isbn: req.params.isbn}, function(err, data) {
        if (err) {
            res.json('Error: '+err);
        } else {
            res.json(data);
        }
    })
});

router.put('/api/toread/:isbn', function(req, res) {
    ToRead.findOne({isbn: req.params.isbn}, function(err, data) {
        if (err) {
            res.json('Error: '+err);
        } else {
            data.isbn = req.body.isbn;
            data.title = req.body.title;
            data.author = req.body.author;
            data.year_published = req.body.year_published;
            data.began_date = req.body.began_date;
            data.notes = req.body.notes;

            data.save(function(err) {
                if (err) {
                    res.json('Error: '+err);
                } else {
                    res.json('Updated Successfully');
                }
            });
        }
    });
});

router.delete('/api/toread/:isbn', function(req, res) {
    ToRead.remove({isbn: req.params.isbn}, function(err) {
        if (err) {
            res.json('Error: '+err);
        } else {
            res.json('Successfully deleted');
        }
    });
});

router.get('/api/reviewed', function(req, res) {
    Reviewed.find(function(err, data) {
        if (err) {
            res.send('Error: '+err);
        } else {
            res.send(data);
        }
    });
});

router.post('/api/reviewed', function(req, res) {
    var reviewed = new Reviewed();
    reviewed.isbn = req.body.isbn;
    reviewed.author = req.body.author;
    reviewed.title = req.body.title;
    reviewed.year_published = req.body.year_published;
    reviewed.began_date = req.body.began_date;
    reviewed.finished_date = req.body.finished_date;
    reviewed.summary = req.body.summary;
    reviewed.notes = req.body.notes;
    reviewed.rating = req.body.rating;
    reviewed.review = req.body.review;
    reviewed.img_url = req.body.img_url;

    reviewed.save(function(err) {
        if (err) {
            res.json('Error: '+err);
        } else {
            res.json('Added review');
        }
    });
});

router.get('/api/reviewed/:isbn', function(req, res) {
    Reviewed.findOne({isbn: req.params.isbn}, function(err, data) {
        if (err) {
            res.json('Error: '+err);
        } else {
            res.json(data);
        }
    })
});

router.put('/api/reviewed/:isbn', function(req, res) {
    Reviewed.findOne({isbn: req.params.isbn}, function(err, data) {
        if (err) {
            res.json('Error: '+err);
        } else {
            data.isbn = req.body.isbn;
            data.author = req.body.author;
            data.title = req.body.title;
            data.year_published = req.body.year_published;
            data.began_date = req.body.began_date;
            data.finished_date = req.body.finished_date;
            data.summary = req.body.summary;
            data.notes = req.body.notes;
            data.rating = req.body.rating;
            data.review = req.body.review;

            data.save(function(err) {
                if (err) {
                    res.json('Error: '+err);
                } else {
                    res.json('Updated successfully');
                }
            })
        }
    });
})

router.delete('/api/reviewed/:isbn', function(req, res) {
    Reviewed.remove({isbn: req.params.isbn}, function(err) {
        if (err) {
            res.json('Error: '+err);
        } else {
            res.json('Successfully deleted');
        }
    });
})

module.exports = router;

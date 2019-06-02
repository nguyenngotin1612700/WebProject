var express = require('express');
var postModel = require('../../models/post.model');

var router = express.Router();

router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    var highlight = postModel.bycatNameAndId('highlights', id);
    highlight.then(rows => {
            res.render('singlepost', {
                rows: rows
            })
        })
        .catch(err => {
            throw err
        });
})

module.exports = router;
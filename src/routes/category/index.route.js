var express = require('express');
var postModel = require('../../models/post.model');

var router = express.Router();

router.get('/:category/:id', (req, res, next) => {
    let id = req.params.id;
    let cat = req.params.category;
    var highlight = postModel.bycatNameAndId(cat, id);
    var post = postModel.all();
    Promise.all([post, highlight]).then(values => {
        console.log('vaule: ', values[0]);
        res.render('singlepost', {
            layout: 'main',
            rows: values[0],
            post: values[1]
        })
    });
})

module.exports = router;
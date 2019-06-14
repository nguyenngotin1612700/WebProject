var express = require('express');
var articleModel = require('../../models/article.model');

var router = express.Router();

router.get('/:categoryId', (req, res, next) => {
    let cat = req.params.categoryId;
    var rows = articleModel.bycatID(cat);
    let latest = articleModel.bypublish(10);
    Promise.all([rows, latest]).then(values => {
        let catname = values[0][0].catname;
        res.render('category', {
            layout: 'main',
            rows: values[0],
            latest: values[1],
            catname: catname
        })
    }).catch(err => {
        throw err;
    });
});
router.get('/:categoryID/:id', (req, res, next) => {
    let id = req.params.id;
    let cat = req.params.categoryID;
    let post = articleModel.bycatNameAndId(cat, id);
    let latest = articleModel.bypublish(10);
    let samecat = articleModel.bycatID(cat);
    Promise.all([post, latest, samecat]).then(values => {
            res.render('singlepost', {
                layout: 'main',
                rows: values[0],
                latest: values[1],
                samecat: values[2]
            })
        })
        .catch(err => {
            throw err;
        });
})

module.exports = router;
var express = require('express');
var articleModel = require('../../models/article.model');
var comment = require('../../models/comment.model');
var tagarticleModel = require('../../models/tagarticle.model');
var router = express.Router();
var moment = require('moment');

router.get('/:categoryId', (req, res, next) => {
    let cat = req.params.categoryId;
    let latest = articleModel.bypublish(10);
    let pagecat = req.query.page || 1;
    if (pagecat < 1) {
        pagecat = 1;
    }
    let limit = 3;
    let offset = (pagecat - 1) * limit;
    let page = articleModel.bypagecatId(cat, limit, offset);
    let totalpost = articleModel.bycountcatID(cat);
    Promise.all([page, latest, totalpost]).then(values => {
        let catname = values[0][0].catname;
        let total = values[2][0].total;
        let npages = Math.floor(total / limit);
        if (total % limit > 0) {
            npages++;
        }
        let pages = [];
        for (i = 1; i <= npages; i++) {
            let obj = {
                value: i,
                active: i === +pagecat
            };
            pages.push(obj);
        }
        let pre = undefined;
        if (pagecat > 1) {
            let pares = parseInt(pagecat);
            pre = pares - 1;
        }
        let next = undefined;
        if (pagecat < npages) {
            let pares = parseInt(pagecat);
            next = pares + 1;
        }
        res.render('category', {
            layout: 'main',
            rows: values[0],
            latest: values[1],
            catname: catname,
            pages: pages,
            pre,
            next
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
    let samecat = articleModel.bycatIDLimit(cat, 5);
    let postcomment = comment.bypostID(id);
    let alltag = tagarticleModel.byarticleID(id);
    Promise.all([post, latest, samecat, postcomment, alltag]).then(values => {
            values[3].forEach(element => {
                element.create_at = moment(element.create_at).format("LL");
            });
            res.render('singlepost', {
                layout: 'main',
                rows: values[0],
                latest: values[1],
                samecat: values[2],
                postcomment: values[3],
                tag: values[4]
            })
        })
        .catch(err => {
            throw err;
        });
})
router.post('/:categoryID/:id', (req, res, next) => {
    console.log('body-------', req.body);
    let cat = req.params.categoryID;
    let id = req.params.id;
    let username = "Ngô Đức Kha";
    let userid = 1;
    req.body.article_id = id;
    req.body.user_id = userid;
    req.body.user_name = username;
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    req.body.create_at = date;
    comment.add(req.body).then(result => {
        res.redirect(`/cat/${cat}/${id}`);
    }).catch(err => {
        throw err;
    });
});
module.exports = router;
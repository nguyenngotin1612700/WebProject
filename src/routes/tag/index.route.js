var express = require('express');
var articleModel = require('../../models/article.model');
var comment = require('../../models/comment.model');
var tagarticleModel = require('../../models/tagarticle.model');
var router = express.Router();
var moment = require('moment');

router.get('/:tagId', (req, res, next) => {
    let tagId = req.params.tagId;
    let latest = articleModel.bypublish(10);
    let tagname = tagarticleModel.bytagID(tagId);

    let pagecat = req.query.page || 1;
    if (pagecat < 1) {
        pagecat = 1;
    }
    let limit = 3;
    let offset = (pagecat - 1) * limit;
    let page = tagarticleModel.bypagetagId(tagId, limit, offset);
    let totalpost = tagarticleModel.bycounttagID(tagId);

    Promise.all([page, latest, tagname, totalpost]).then(values => {
        let name = values[2][0].name;

        let total = values[3][0].total;
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

        res.render('tag', {
            layout: 'main',
            article: values[0],
            latest: values[1],
            name,
            pages,
            pre,
            next
        });
    }).catch(err => {
        throw err
    });
});
router.get('/:tagID/:id', (req, res, next) => {})
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
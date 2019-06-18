var express = require('express');
var articleModel = require('../../models/article.model');
var comment = require('../../models/comment.model');
var tagarticleModel = require('../../models/tagarticle.model');
var router = express.Router();
var moment = require('moment');

router.get('/', (req, res, next) => {
    let search = req.query.search;
    let pagecat = req.query.page || 1;
    if (pagecat < 1) {
        pagecat = 1;
    }
    let limit = 3;
    let offset = (pagecat - 1) * limit;
    let latest = articleModel.bypublish(10);
    let article = articleModel.byfulltextSearch(search, limit, offset);
    let totalpost = articleModel.bycountFulltextSearch(search);
    if (req.user) {
        let today = moment();
        if (moment(res.locals.user.expiry_date).isAfter(today)) {
            console.log('ahihi');
            article = articleModel.byfulltextSearchPremium(search, limit, offset);
            totalpost = articleModel.bycountFulltextSearchPremium(search);
        }
    }
    Promise.all([article, latest, totalpost]).then(values => {
        let rows = values[0];
        let latest = values[1];
        rows.forEach(element => {
            element.publish_at = moment().format("LL");
        })
        latest.forEach(element => {
            element.publish_at = moment().format("LL");
        })
        let total = values[2][0].total;
        let npages = Math.floor(total / limit);
        if (total % limit > 0) {
            npages++;
        }
        let pages = [];
        for (i = 1; i <= npages; i++) {
            let obj = {
                value: i,
                active: i === +pagecat,
                search: search
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

        res.render('search', {
            layout: 'main',
            search,
            latest,
            rows,
            pages,
            pre,
            next
        })
    }).catch(err => {
        throw err;
    })

})

module.exports = router;
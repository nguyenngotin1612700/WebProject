var express = require('express');
var articleModel = require('../../models/article.model');
var categoryModel = require('../../models/category.model');
let authAdmin = require('../../middleware/isAdmin');
var comment = require('../../models/comment.model');
var tagarticleModel = require('../../models/tagarticle.model');
var router = express.Router();
var moment = require('moment');
var auth = require('../../middleware/auth');
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
    if (req.user) {
        let today = moment();
        if (moment(res.locals.user.expiry_date).isAfter(today)) {
            console.log('ahihi');
            page = articleModel.bypagecatIDpremiumArticle(cat, limit, offset);
            totalpost = articleModel.bycouncatPremium(cat);
        }
    }
    Promise.all([page, latest, totalpost]).then(values => {
        let catname = values[0][0].catname;
        let total = values[2][0].total;
        let npages = Math.floor(total / limit);
        values[0].forEach(element => {
            element.publish_at = moment().format("LL");
        })
        values[1].forEach(element => {
            element.publish_at = moment().format("LL");
        })

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
    if (res.locals.user) {
        if (res.locals.user.role === 'writer') {
            post = articleModel.byId(id);
        }
    }
    Promise.all([post, latest, samecat, postcomment, alltag]).then(values => {
            values[1].forEach(element => {
                element.publish_at = moment().format("LL");
            });
            values[2].forEach(element => {
                element.publish_at = moment().format("LL");
            });
            values[3].forEach(element => {
                element.create_at = moment().format("LL");
            });
            values[0][0].publish_at = moment().format("LL");
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
router.post('/:categoryID/:id', auth, (req, res, next) => {
    console.log('body-------', req.body);
    let cat = req.params.categoryID;
    let id = req.params.id;
    let userid = 1;
    req.body.article_id = id;
    req.body.user_id = res.locals.user.id;
    req.body.user_name = res.locals.user.name;
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    req.body.create_at = date;
    comment.add(req.body).then(result => {
        console.log('result---------', result.insertId);
        res.redirect(`/cat/${cat}/${id}`);
    }).catch(err => {
        throw err;
    });
});
router.get('/premium/:categoryID/:id', auth, (req, res, next) => {
    let id = req.params.id;
    let cat = req.params.categoryID;
    let post = articleModel.bycatNameAndId(cat, id);
    let latest = articleModel.bypublish(10);
    let samecat = articleModel.bycatIDLimit(cat, 5);
    let postcomment = comment.bypostID(id);
    let alltag = tagarticleModel.byarticleID(id);
    if (req.user) {
        let today = moment();
        if (moment(res.locals.user.expiry_date).isAfter(today)) {
            console.log('ahihi');
            post = articleModel.bycatNameAndIdPremium(cat, id);
        }
    }
    Promise.all([post, latest, samecat, postcomment, alltag]).then(values => {
            values[0].forEach(element => {
                element.publish_at = moment().format("LL");
            });
            values[1].forEach(element => {
                element.publish_at = moment().format("LL");
            });
            values[2].forEach(element => {
                element.publish_at = moment().format("LL");
            });
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
});
module.exports = router;
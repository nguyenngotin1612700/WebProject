var express = require('express');
var articleModel = require('../../models/article.model');
var comment = require('../../models/comment.model');
var tagarticleModel = require('../../models/tagarticle.model');
var categoryModel = require('../../models/category.model');
var router = express.Router();
var moment = require('moment');

let authWriter = require('../../middleware/isWriter')
router.get('/manageArticle', authWriter, (req, res) => {
    let article = articleModel.byUserId(res.locals.user.id);
    article.then(result => {
        res.render('writer/manageArticle', {
            layout: 'main',
            rows: result
        });
    })

});
router.post('/manageArticle/delete', (req, res) => {
    console.log('req.body--------', req.body);
    tagarticleModel.delete('id_article', req.body.id).then(result => {
        console.log('delete thanh cong,', result);
        articleModel.delete('id', req.body.id).then(result => {
            console.log('delete article thanh cong', result);
            res.redirect('/writer/manageArticle');
        }).catch(err => {
            throw err;
        })
    }).catch(err => {
        throw err;
    })
});
router.get('/manageArticle/edit', authWriter, (req, res, next) => {
    let cat = categoryModel.allchild();
    let article = articleModel.byId(req.query.id);
    let tag = tagarticleModel.allTag();
    let alltagArtile = tagarticleModel.byarticleIDSingle(req.query.id);
    Promise.all([article, cat, tag, alltagArtile]).then(values => {
        article = values[0][0];
        values[1].forEach(element => {
            if (element.id === article.category_id) {
                element.selected = true;
            }
        });
        values[2].forEach(element => {
            values[3].forEach(elem => {
                if (element.id === elem.id_tag) {
                    element.selected = true;
                }
            });
        });
        console.log('values[3]', values[2]);
        res.render('writer/edit', {
            layout: 'main',
            article,
            allcat: values[1],
            alltag: values[2]
        })
    }).catch(err => {
        throw err;
    })

});
router.post('/manageArticle/edit', authWriter, (req, res, next) => {
    let today = moment().format('L');
    let article = {
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        category_id: req.body.category_id,
        create_at: today,
        avatar: req.body.avatar,
        author: res.locals.user.id,
        status: "new",
        ispremium: 0,
    }
    let tag = req.body.tag;
    console.log('tag--------', tag);
    let category = categoryModel.byId(req.body.category_id);
    let deleteTag = tagarticleModel.delete('id_article', req.body.id);
    Promise.all([category, deleteTag]).then(values => {
        article.catname = values[0][0].name;
        articleModel.update(article).then(result => {
            if (tag) {
                let tagArr = [];
                if (Array.isArray(tag)) {
                    tag.forEach(element => {
                        let obj = {
                            id_tag: element,
                            id_article: req.body.id
                        }
                        tagArr.push(tagarticleModel.add(obj));
                    });
                } else {
                    let obj = {
                        id_tag: tag,
                        id_article: req.body.id
                    }
                    tagArr.push(tagarticleModel.add(obj))
                }
                Promise.all(tagArr).then(values => {
                    console.log('values-------', values);
                    res.redirect('/');
                }).catch(err => {
                    throw err;
                })
            } else {
                res.redirect('/')
            }
        }).catch(err => {
            throw err;
        })
    }).catch(err => {
        throw err;
    })
})
router.get('/upload', authWriter, (req, res, next) => {
    let cat = categoryModel.allchild();
    let tag = tagarticleModel.allTag();
    Promise.all([cat, tag]).then(values => {
        let allcat = values[0];
        let alltag = values[1];
        console.log('alllcat------', allcat);
        console.log('alltag----------', alltag);
        res.render('writer/upload', {
            allcat,
            alltag
        });
    }).catch(err => {
        throw err;
    })
});
router.post('/upload', authWriter, (req, res, next) => {
    console.log('req.body-------', req.body);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    let article = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        category_id: req.body.category_id,
        create_at: today,
        avatar: req.body.avatar,
        author: res.locals.user.id,
        status: "new",
        ispremium: 0,
    }
    let tag = req.body.tag;
    let category = categoryModel.byId(req.body.category_id);
    category.then(result => {
        article.catname = result[0].name;
        articleModel.add(article).then(result => {
            if (tag) {
                let tagArr = [];
                if (Array.isArray(tag)) {
                    tag.forEach(element => {
                        let obj = {
                            id_tag: element,
                            id_article: result.insertId
                        }
                        tagArr.push(tagarticleModel.add(obj));
                    });
                } else {
                    let obj = {
                        id_tag: tag,
                        id_article: result.insertId
                    }
                    tagArr.push(tagarticleModel.add(obj))
                }
                Promise.all(tagArr).then(values => {
                    console.log('values-------', values);
                    res.redirect('/');
                }).catch(err => {
                    throw err;
                })
            } else {
                res.redirect('/')
            }
        })
    }).catch(err => {
        throw err;
    });
});
module.exports = router;
var express = require('express');
var articleModel = require('../../models/article.model');
var comment = require('../../models/comment.model');
var tagarticleModel = require('../../models/tagarticle.model');
var categoryModel = require('../../models/category.model');
var router = express.Router();
var moment = require('moment');

let authWriter = require('../../middleware/isWriter')
router.get('/manageArticle',authWriter,(req,res)=>{
    res.render('writer/manageArticle',{layout:'main'});
});

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
            if(tag) {
            let tagArr = [];
            tag.forEach(element => {
                let obj = {
                    id_tag: element,
                    id_article: result.insertId
                }
                tagArr.push(tagarticleModel.add(obj));
            })
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
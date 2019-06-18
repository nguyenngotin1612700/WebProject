express = require('express');

let router = express.Router();
let authEditor = require('../../middleware/isEditor');
let articleModel = require('../../models/article.model');
let moment = require ('moment');

router.get('/manageArticle',authEditor,(req,res)=>{
    articleModel.allNewByCategory(res.locals.user.manage_category).then((result)=>{
        res.render('editor/manageArticle',{layout:'main',article:result});
    })
});
router.get('/review/:categoryId/:Id',authEditor,(req,res)=>{
    articleModel.byIdWithCatName(req.params.Id)
    .then((result)=>{
        res.render('editor/singlepostReview',{layout:'main', article : result});
    })
})

router.post('/review/:categoryId/:Id',authEditor,(req,res)=>{
    if (req.body.message_reject) {
        articleModel.reject(req.params.Id, req.body.message_reject)
        .then(()=>{
            res.redirect('/editor/manageArticle');
        })
        .catch(err=>{
            throw err;
        })
        return;
    }
    
    articleModel.approved(req.params.Id,moment(req.body.datePublish,'DD/MM/YYYY').format('YYYY-MM-DD'))
    .then(()=>{
        res.redirect('/editor/manageArticle');
    })
    .catch(err=>{
        throw err;
    })
    
})
module.exports = router;
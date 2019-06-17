express = require('express');
let moment = require('moment');

let authAdmin = require('../../middleware/isAdmin');

let articleModel = require('../../models/article.model');

let categoryModel = require('../../models/category.model');

let auth = require('../../middleware/auth');

let UserModel = require('../../models/user.model');

let router = express.Router();

router.get('/manageCategories', authAdmin, (req, res, next) => {
    let parentCat = [];
    let childCat = [];
    res.locals.category.forEach(row => {
        if (row.parent_id === null) {
            parentCat.push(row);
        } else {
            childCat.push(row);
        }
    });
    parentCat.forEach((row, index) => {
        let children = [];
        childCat.forEach(rowchild => {
            if (rowchild.parent_id === row.id)
                children.push(rowchild);
        })
        parentCat[index] = { row, children };
    })
    res.render('admin/manageCategories', { layout: 'main', categories: parentCat });
});
router.get('/manageTag', authAdmin, (req, res) => {
    res.render('admin/manageTag', { layout: 'main' })
});
router.get('/manageArticle', authAdmin, (req, res) => {
    let result = articleModel.byStatus('new');
    result.then(value => {
        res.render('admin/manageArticle', { layout: 'main', article: value })
    })
        .catch(err => {
            console.log(err);
        })

});
router.get('/manageUser', authAdmin, (req, res) => {
    let usernormal = UserModel.allByRole('user');
    let writer = UserModel.allByRole('writer');
    let editor = UserModel.allEditor();
    let childCat = [];
    res.locals.category.forEach(row => {
        if (row.parent_id !== null) {
            childCat.push(row);
        }
    });
    Promise.all([usernormal, writer, editor])
        .then(values => {
            let editorWithCategories = []
            values[2].forEach((row,index)=>{
                editorWithCategories[index]= {row,childCat}
            })
            res.render('admin/manageUser', {
                layout: 'main',
                usernormal: values[0],
                writer: values[1],
                editor: editorWithCategories,
                categories: childCat
            });
        })

});
router.get('/review/:categoryId/:id', authAdmin, (req, res, next) => {
    let id = req.params.id;
    let cat = req.params.categoryId;
    let post = articleModel.bycatNameAndId(cat, id);
    post.then(value => {
        res.render('admin/singlepostReview', { layout: 'main', singlepost: value });
    })
        .catch(err => {
            throw err;
        })
})

router.post('/review/:categoryId/:id', authAdmin, (req, res, next) => {
    if (req.body.message_reject) {
        ArticleModel.reject(req.params.id, req.body.message_reject);
        res.redirect('/admin/manageArticle');
        return;
    }
    ArticleModel.publish(req.params.id, moment(new Date()).format('YYYY-MM-DD'));
    res.redirect('/admin/manageArticle');
})

router.post('/manageCategories/:id', authAdmin, (req, res, next) => {
    categoryModel.updateName(req.body.categoryName, req.params.id);
    res.redirect('/admin/manageCategories')
});
router.post('/manageCategories', authAdmin, (req, res, next) => {
    let entity;
    let name = req.body.categoryName;
    let parent_id;
    if (req.body.parent != '0') {
        parent_id = parseInt(req.body.parent);
    }
    entity = {
        name,
        parent_id
    }
    categoryModel.add(entity);
    res.end('...');
})
module.exports = router;
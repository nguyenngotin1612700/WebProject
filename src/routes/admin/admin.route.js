express = require('express');
let moment = require('moment');

let authAdmin = require('../../middleware/isAdmin');

let articleModel = require('../../models/article.model');

let categoryModel = require('../../models/category.model');

let auth = require('../../middleware/auth');

let UserModel = require('../../models/user.model');

let TagModel = require('../../models/tag.model');

let router = express.Router();

router.get('/manageCategories', authAdmin, (req, res, next) => {
    let parentCat = [];
    let childCat = [];
    res.app.locals.category.forEach(row => {
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
        parentCat[index] = {
            row,
            children
        };
    })
    res.render('admin/manageCategories', {
        layout: 'main',
        categories: parentCat
    });
});
router.get('/manageTag', authAdmin, (req, res) => {
    TagModel.all()
        .then(result => {
            res.render('admin/manageTag', {
                layout: 'main',
                tag: result
            })
        })
        .catch(err => {
            throw err;
        })

});
router.post('/manageTag', authAdmin, (req, res) => {
    TagModel.add(req.body.tagNameAdd)
        .then(() => {
            res.redirect('/admin/manageTag');
        })
})
router.post('/manageTag/:tagId', authAdmin, (req, res) => {
    TagModel.updateName(req.body.tagName, req.params.tagId)
        .then(result => {
            res.redirect('/admin/manageTag');
        })
});
router.get('/manageArticle', authAdmin, (req, res) => {
    let result = articleModel.byStatus('new');
    result.then(value => {
            res.render('admin/manageArticle', {
                layout: 'main',
                article: value
            })
        })
        .catch(err => {
            console.log(err);
        })

});

router.get('/review/:categoryId/:id', authAdmin, (req, res, next) => {
    let id = req.params.id;
    let cat = req.params.categoryId;
    let post = articleModel.bycatNameAndIdStatus(cat, id, 'new');
    post.then(value => {
            res.render('admin/singlepostReview', {
                layout: 'main',
                singlepost: value
            });
        })
        .catch(err => {
            throw err;
        })
})

router.post('/review/:categoryId/:id', authAdmin, (req, res, next) => {
    if (req.body.message_reject) {
        articleModel.reject(req.params.id, req.body.message_reject);
        res.redirect('/admin/manageArticle');
        return;
    }
    articleModel.publish(req.params.id, moment(new Date()).format('YYYY-MM-DD'));
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
});

router.get('/manageUser', authAdmin, (req, res) => {
    let usernormal = UserModel.allByRole('user');
    let writer = UserModel.allByRole('writer');
    let editor = UserModel.allEditor();
    let childCat = [];
    res.app.locals.category.forEach(row => {
        if (row.parent_id !== null) {
            childCat.push(row);
        }
    });
    Promise.all([usernormal, writer, editor])
        .then(values => {
            let editorWithCategories = []
            values[2].forEach((row, index) => {
                editorWithCategories[index] = {
                    row,
                    childCat
                }
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
router.post('/manageUser/writer/:writerId', authAdmin, (req, res) => {
    let name = req.body.writerName;
    let password = req.body.writerPassword;
    let id = req.params.writerId;
    let input = []
    if (name != '') {
        let updateName = UserModel.updateName(name, id);
        input.push(updateName)
    }
    if (password != '') {
        let saltround = 10;
        let hash = bcrypt.hashSync(password, saltround);
        let updatePassword = UserModel.updatePassword(hash, id);
        input.push(updatePassword);
    }
    Promise.all(input)
        .then(() => {
            res.redirect('/admin/manageUser');
        })
        .catch((err) => {
            throw err;
        })
});

router.post('/manageUser/editor/:editorId', authAdmin, (req, res) => {
    let name = req.body.editorName;
    let password = req.body.editorPassword;
    let id = req.params.editorId;
    let manage_category = req.body.CategoryManage;
    let input = []
    if (name != '') {
        let updateName = UserModel.updateName(name, id);
        input.push(updateName)
    }
    if (password != '') {
        let saltround = 10;
        let hash = bcrypt.hashSync(password, saltround);
        let updatePassword = UserModel.updatePassword(hash, id);
        input.push(updatePassword);
    }
    let updateManageCategory = UserModel.updateCategoryManage(manage_category, id);
    input.push(updateManageCategory);
    Promise.all(input)
        .then(() => {
            res.redirect('/admin/manageUser');
        })
        .catch((err) => {
            throw err;
        })
});

router.post('/manageUser/user/:userId', authAdmin, (req, res) => {
    let name = req.body.userName;
    let password = req.body.userPassword;
    let id = req.params.userId;
    let renew = req.body.renew;
    let input = [];
    if (name != '') {
        let updateName = UserModel.updateName(name, id);
        input.push(updateName)
    }
    if (password != '') {
        let saltround = 10;
        let hash = bcrypt.hashSync(password, saltround);
        let updatePassword = UserModel.updatePassword(hash, id);
        input.push(updatePassword);
    }
    if (renew == 'on') {
        let expiry_date = moment().add(7, 'days');
        expiry_date = moment(expiry_date).format('YYYY-MM-DD');
        let renewUser = UserModel.renewUser(expiry_date, id);
        input.push(renewUser);
    }
    Promise.all(input)
        .then(() => {
            res.redirect('/admin/manageUser');
        })
        .catch((err) => {
            throw err;
        })
});

router.post('/manageUser/delete/:id', authAdmin, (req, res) => {
    UserModel.InactiveUser(req.params.id)
        .then(() => {
            res.redirect('/admin/manageUser');
        })
})

router.post('/manageUser/user', authAdmin, (req, res) => {
    let name = req.body.nameUser;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let saltround = 10;
    let hash = bcrypt.hashSync(password, saltround);
    let expiry_date = moment().add(7, 'days');
    expiry_date = moment(expiry_date).format('YYYY-MM-DD');
    let entity = {
        username,
        password: hash,
        name,
        email,
        expiry_date,
        role: 'user'
    }
    UserModel.add(entity)
        .then(() => res.redirect('/admin/manageUser'))
        .catch(err => {
            throw err;
        })
});
router.post('/manageUser/writer', authAdmin, (req, res) => {
    let name = req.body.nameWriter;
    let email = req.body.emailWriter;
    let username = req.body.username;
    let password = req.body.passwordWriter;
    let saltround = 10;
    let hash = bcrypt.hashSync(password, saltround);
    let entity = {
        username,
        password: hash,
        name,
        email,
        role: 'writer'
    }
    UserModel.add(entity)
        .then(() => res.redirect('/admin/manageUser'))
        .catch(err => {
            throw err;
        })
})
router.post('/manageUser/editor', authAdmin, (req, res) => {
    let name = req.body.nameEditor;
    let email = req.body.emailEditor;
    let username = req.body.username;
    let password = req.body.passwordEditor;
    let manage_category = req.body.CategoryManage;
    let saltround = 10;
    let hash = bcrypt.hashSync(password, saltround);
    let entity = {
        username,
        password: hash,
        name,
        email,
        manage_category,
        role: 'editor'
    }
    UserModel.add(entity)
        .then(() => res.redirect('/admin/manageUser'))
        .catch(err => {
            throw err;
        })
})

module.exports = router;
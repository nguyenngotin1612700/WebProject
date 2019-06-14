var express = require('express');
var exphbs = require('express-handlebars');
var Handlebars = require('handlebars');
var dateFormat = require('dateFormat');
var minify = require('html-minifier').minify;
var app = express();

app.use(express.urlencoded());
var categoryModel = require('./models/category.model');
var articleModel = require('./models/article.model');
var highlights = require('./routes/category/index.route');
require('./middleware/viewEngine')(app);
require('./middleware/session')(app);
require('./middleware/passport')(app);
var server = app.listen(8000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Ung dung Node.js dang hoat dong tai dia chi: http://%s:%s", host, port)
});
app.use(require('./middleware/auth.local'));
app.use(express.static('public'));
app.use('/cat', highlights);
app.use('/', (req, res, next) => {
    let cat = categoryModel.all();
    cat.then(value => {
        res.locals.category = value;
        let parentCat = [];
        let childCat = [];
        value.forEach(row => {
            if (row.parent_id === null) {
                parentCat.push(row);
            } else {
                childCat.push(row);
            }
        });
        let html = '';
        parentCat.forEach(parent => {
            let htmlChild = '<div class="dropdown-content" aria-labelledby="navbarDropdown">';
            childCat.forEach(child => {
                if (child.parent_id === parent.id) {
                    htmlChild = htmlChild + '<a class="dropdown-item" href="/cat/' + child.id + '">' + child.name + '</a>';
                }
            });
            htmlChild += '</div>';
            html = html + '<li class="nav-item dropdown mr-1"><button type="button" class="btn btn-light text-uppercase font-weight-bold">' +
                parent.name +
                ' <span> <img src="/img/icondown.png" alt=""> </span></button>' +
                htmlChild +
                '</li>';
        });
        res.locals.navbar = html;
        next();
    })
})

Handlebars.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Handlebars.registerHelper('ifMoreCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
app.use('/account',require('./routes/account/account.route'));
app.use('/admin',require('./routes/admin/admin.route'));
app.use('/editor',require('./routes/editor/editor.route'));
app.use('/writer',require('./routes/writer/writer.router'));
app.get('/', function (req, res) {
    let value = [];
    // let post = articleModel.all();
    let viewMost = articleModel.byView(4);
    let trongnuoc = articleModel.bycatIDLimit(2, 1);
    let quocte = articleModel.bycatIDLimit(3, 1);
    let latest = articleModel.bypublish(10);
    value.push(viewMost);
    value.push(trongnuoc);
    value.push(quocte);
    value.push(latest);
    //let tintrongnuoc = articleModel.bycatIDLimit(2,1);
    for (let i = 4; i <= 13; i++) {
        value.push(articleModel.bycatIDLimit(res.locals.category[i].id, 2));
    }
    Promise.all(value).then(values => {
        let viewMost = values.shift();
        let trongnuoc = values.shift();
        let quocte = values.shift();
        let latest = values.shift();
        viewMost[0].isActive = true;


        res.render('home', {
            layout: 'main',
            viewMost: viewMost,
            trongnuoc: trongnuoc,
            quocte: quocte,
            latest: latest,
            rows: values,
            navbar: res.locals.navbar
        })
    });
});




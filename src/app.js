var express = require('express');
var exphbs = require('express-handlebars');
var Handlebars = require('handlebars');
var dateFormat = require('dateFormat');
var minify = require('html-minifier').minify;
var app = express();
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
var categoryModel = require('./models/category.model');
var postModel = require('./models/post.model');
var highlights = require('./routes/category/index.route')
var server = app.listen(8000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Ung dung Node.js dang hoat dong tai dia chi: http://%s:%s", host, port)
});

app.use(express.static('public'));
app.use('/cat', highlights);
Handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
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
app.get('/', function (req, res) {
    let post = postModel.all();
    let catPost = postModel.bycatNameLimit('noibat', 4);
    Promise.all([post, catPost]).then(values => {
        values[1][0].isActive = true;
        console.log('vaule: ', values[0]);
        res.render('home', {
            layout: 'main',
            rows: values[0],
            highlight: values[1]
        })
    })
});
app.get('/text.txt', function (req, res) {
    res.send('text.txt');
});
app.post('/', function (req, res) {
    console.log("POST request");
    res.send("hello POST");
    res.end();
});

app.delete('/delete', function (req, res) {
    console.log("DELETE Request");
    res.send('Hello DELETE');
    res.end();
});

app.get('/ab*cd', function (req, res) {
    console.log(req.body);
    console.log("GET request /ab*cd");
    res.send('Page Pattern Match');
    res.end();
});

var testMinify = minify('<div class="my-mark "> <p class = "ml-3"></p> </div>', {
    removeAttributeQuotes: true
});
console.log('testMinify-------', testMinify);
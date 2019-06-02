var express = require('express');
var exphbs = require('express-handlebars');
var Handlebars = require('handlebars');
var dateFormat = require('dateFormat');
var app = express();
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
var categoryModel = require('./models/category.model');
var postModel = require('./models/post.model');
var highlights = require('./routes/category/highlights.route')
var server = app.listen(8000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Ung dung Node.js dang hoat dong tai dia chi: http://%s:%s", host, port)
});

app.use(express.static('public'));
app.use('/highlights', highlights);
// Handlebars.registerHelper('table', function (data) {
//     var str = '<table>';
//     for (var i = 0; i < data.length; i++) {
//         str += '<tr>';
//         for (var key in data[i]) {
//             str += '<td>' + data[i][key] + '</td>';
//         };
//         str += '</tr>';
//     };
//     str += '</table>';

//     return new Handlebars.SafeString(str);
// });

app.get('/', function (req, res) {
    let post = postModel.all();
    let catPost = postModel.bycatName('highlights');
    Promise.all([post, catPost]).then(values => {
        values[1][0].isActive = true;
        console.log('vaule: ', values[1]);
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
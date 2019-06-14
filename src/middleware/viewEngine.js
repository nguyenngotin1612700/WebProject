var exphbs  = require('express-handlebars');
module.exports = function (app){
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        layoutsDir:'views/layouts'
    }));
    app.set('view engine', 'handlebars');
}
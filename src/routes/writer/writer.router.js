express = require('express');

let router = express.Router();
let authWriter = require('../../middleware/isWriter')
router.get('/manageArticle',authWriter,(req,res)=>{
    res.render('writer/manageArticle',{layout:'main'});
});

module.exports = router;
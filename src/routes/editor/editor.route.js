express = require('express');

let router = express.Router();
let authEditor = require('../../middleware/isEditor');

router.get('/manageArticle',authEditor,(req,res)=>{
    res.end('manageArticle')
});

module.exports = router;
express = require('express');
let authAdmin = require('../../middleware/isAdmin');

let router = express.Router();

router.get('/manageCategories',authAdmin,(req,res)=>{
    res.end('manageCategories')
});
router.get('/manageTag',authAdmin,(req,res)=>{
    res.end('manageTag')
});
router.get('/manageArticle',authAdmin,(req,res)=>{
    res.end('manageArticle')
});
router.get('/manageUser',authAdmin,(req,res)=>{
    res.end('manageUser')
});
module.exports = router;
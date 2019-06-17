express = require('express');

userModel = require('../../models/user.model')

bcrypt = require('bcrypt');

moment = require('moment');

passport = require('passport')

auth = require('../../middleware/auth')

let router = express.Router();

router.get('/is-available', (req, res, next) => {
    var user = req.query.username;
    userModel.singleByUsername(user).then(rows => {
      if (rows.length > 0) {
        return res.json(false);
      }
  
      return res.json(true);
    })
});

router.get('/register', (req, res) => {
    res.render('account/register', { layout: false });
});

router.post('/register', (req, res) => {
    let saltround = 10;
    let hash = bcrypt.hashSync(req.body.password, saltround);
    let dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    let expiry_date = moment().add(7,'days');
    expiry_date = moment(expiry_date).format('YYYY-MM-DD');


    let entity = {
        username: req.body.username,
        password: hash,
        name: req.body.name,
        email: req.body.email,
        dob,
        expiry_date,
        role:'user'
    }

    userModel.add(entity)
        .then(() => res.redirect('/account/login'))
        .catch(err => {
            console.log(err + "");
            res.render('account/register', { layout: false });
        })
});

router.get('/login', (req, res) => {
    res.render('account/login', { layout: false });
})

router.post('/login', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('account/login',{
                layout:false,
                err_message: info.message
            })
        }
            req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
});


router.post('/logout',auth,(req,res,next)=>{
    req.logOut();
    res.redirect('/account/login');
})



router.get('/profile',auth,(req,res,next )=>{
    res.end('profile');
})



module.exports = router;
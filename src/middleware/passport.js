let passport = require('passport')

let UserModel = require('../models/user.model')

let bcrypt = require('bcrypt');

let LocalStrategy = require('passport-local').Strategy

module.exports = (app)=>{
    app.use(passport.initialize());
    app.use(passport.session());

    let ls = new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
    },(username,password, done)=>{
        UserModel.singleByUsername(username)
        .then(rows=>{
            if(rows.length === 0){
                return done(null,false,{message:'Invalid username'});
            }
            
            let user = rows[0];

            let ret = bcrypt.compareSync(password,rows[0].password);

            if(ret){
                if(user.status =='active'){
                    return done(null,user);
                }
                return done(null,false,{message:'User is block'});
            }
            return done(null,false,{message:'Invalid password'})

        })
        .catch(err=> {
            return done(err,false);
        })

    });

    passport.use(ls);

    passport.serializeUser((user,done)=>{
        return done(null,user);
    });

    passport.deserializeUser((user,done)=>{
        return done(null,user);
    });

}
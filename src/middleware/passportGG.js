let passport = require('passport');
let googleStrategy = require('passport-google-oauth20');
let keys = require('./keys');
let UserModel = require ('../models/user.model');

module.exports = (app)=>{

let GGS = new googleStrategy({
    callbackURL:'/account/google/abc',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
},(accessToken,refreshToken,profile,done)=>{

    let googleId = profile.id;
    let name = profile.displayName;
    let expiry_date = moment().add(7,'days');
    expiry_date = moment(expiry_date).format('YYYY-MM-DD');
    UserModel.singleByUsername(googleId)
    .then(rows=>{
        if(rows.length === 0){
            let entity = {
                username: googleId,
                name,
                expiry_date,
                role:'user'
            }
            UserModel.add(entity)
            .then(() => {
                UserModel.singleByUsername(googleId)
                .then(val=>{
                    let newuser = val[0];
                    done(null,newuser);
                })
            })
            .catch(err => {
            console.log(err + "");
        })
        }
        else{
            let currentUser = rows[0];
            if(currentUser.status =='active'){
            done(null,currentUser);
            }
            else
            done(null,false);
        }
    })
})
passport.use(GGS);
}
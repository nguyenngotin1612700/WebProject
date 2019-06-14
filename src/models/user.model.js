let db = require('../utils/db');

module.exports ={
    add : (entity)=>{
        return db.add('user',entity);
    },
    singleByUsername : (username)=>{
        return db.singleByUsername(username);
    }
}
var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from tag');
    },
    add: (name)=>{
        return db.load(`insert into tag(name) values('${name}')`);
    },
    updateName:(name,id)=>{
        return db.load(`update tag set name ='${name}' where id = ${id}`);
    }
}
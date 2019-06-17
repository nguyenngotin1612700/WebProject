var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from category');
    },
    updateName:(name,id)=>{
        return db.load(`update category set name = '${name}' where id = ${id}`);
    },
    add: (entity) =>{
        return db.add('category',entity);
    }
}
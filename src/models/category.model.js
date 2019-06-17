var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from category');
    },
    allchild: () => {
        return db.load(`select * from category where parent_id != 'null'`)
    },
    byId: (id) => {
        return db.load(`select * from category where id=${id}`)
    }
}
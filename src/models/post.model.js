var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from post');
    },
    bycatName: (catName) => {
        return db.load(`select * from post where category="${catName}"`);
    },
    bycatNameAndId: (catName, id) => {
        return db.load(`select * from post where category ="${catName} and id=${id}"`);
    }
}
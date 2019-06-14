var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from comment');
    },
    bypostID: (id) => {
        return db.load(`select * from comment where article_id=${id} ORDER BY create_at DESC`);
    },
    add: (entity) => {
        return db.add('comment', entity);
    }
}
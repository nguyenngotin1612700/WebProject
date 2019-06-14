var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from article');
    },
    byView: (limit) => {
        return db.load(`select * from article ORDER BY view DESC limit ${limit}`);
    },
    bycatID: (catId) => {
        return db.load(`select * from article where category_id="${catId}"`);
    },
    bycatNameAndId: (catID, id) => {
        return db.load(`select * from article where category_id ="${catID}" and id=${id}`);
    },
    bypagecatId: (catID, limit, offset) => {
        return db.load(`select * from article where category_id="${catID}" order by publish_at LIMIT ${limit} OFFSET ${offset}`)
    },
    bycountcatID: (catId) => {
        return db.load(`select count(*) as total from article where category_id="${catId}"`)
    },
    bycatIDLimit: (catID, limit) => {
        return db.load(`select * from article where category_id="${catID}" order by publish_at LIMIT ${limit}`)
    },
    bypublish: (limit) => {
        return db.load(`select * from article order by publish_at DESC limit ${limit}`)
    }
}
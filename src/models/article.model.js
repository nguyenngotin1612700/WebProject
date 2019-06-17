var db = require('../utils/db');
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;
module.exports = {
    all: () => {
        return db.load(`select * from article where status='published' or (status='approved' and publish_at < '${today})`);
    },
    byView: (limit) => {
        return db.load(`select * from article where status='published' or (status='approved' and publish_at < '${today}') ORDER BY view DESC limit ${limit}`);
    },
    byId: (id) => {
        return db.load(`select * from article where id=${id}`)
    },
    bycatID: (catId) => {
        return db.load(`select * from article where category_id="${catId}" and (status='published' or (status='approved' and publish_at < '${today}'))`);
    },
    bycatNameAndId: (catID, id) => {
        return db.load(`select * from article where category_id ="${catID}" and id=${id} and ispremium=0 and (status='published' or (status='approved' and publish_at < '${today}'))`);
    },
    bycatNameAndIdPremium: (catID, id) => {
        return db.load(`select * from article where category_id ="${catID}" and id=${id} and (status='published' or (status='approved' and publish_at < '${today}'))`)
    },
    bypagecatId: (catID, limit, offset) => {
        return db.load(`select * from article where category_id="${catID}" and ispremium=0 and (status='published' or (status='approved' and publish_at < '${today}')) order by publish_at DESC LIMIT ${limit} OFFSET ${offset}`)
    },
    bycountcatID: (catId) => {
        return db.load(`select count(*) as total from article where category_id="${catId}" and ispremium=0 and (status='published' or (status='approved' and publish_at < '${today}'))`)
    },
    bycatIDLimit: (catID, limit) => {
        return db.load(`select * from article where category_id="${catID}" and ispremium=0 and (status='published' or (status='approved' and publish_at < '${today}')) order by publish_at DESC LIMIT ${limit}`)
    },
    bypublish: (limit) => {
        return db.load(`select * from article where status='published' or (status='approved' and publish_at < '${today}') order by publish_at DESC limit ${limit}`)
    },
    byfulltextSearch: (keyword, limit, offset) => {
        return db.load(`select * from article where MATCH (title, description, catname, content) AGAINST('"${keyword}"' IN BOOLEAN MODE) and ispremium=0 and (status='published' or (status='approved' and publish_at < '${today}')) order by publish_at DESC LIMIT ${limit} OFFSET ${offset}`)
    },
    bycountFulltextSearch: (keyword) => {
        return db.load(`select count(*) as total from article where MATCH (title, description, catname, content) AGAINST('"${keyword}"') and ispremium=0 and (status='published' or (status='approved' and publish_at < '${today}'))`)
    },
    bypagecatIDpremiumArticle: (catID, limit, offset) => {
        return db.load(`select * from article where category_id="${catID}" and (status='published' or (status='approved' and publish_at < '${today}')) order by ispremium DESC, publish_at DESC LIMIT ${limit} OFFSET ${offset} `)
    },
    bycouncatPremium: (catId) => {
        return db.load(`select count(*) as total from article where category_id="${catId}" and (status='published' or (status='approved' and publish_at < '${today}'))`)
    },
    byfulltextSearchPremium: (keyword, limit, offset) => {
        return db.load(`select * from article where MATCH (title, description, catname, content) AGAINST('"${keyword}"' IN BOOLEAN MODE) and (status='published' or (status='approved' and publish_at < '${today}')) order by ispremium DESC, publish_at DESC LIMIT ${limit} OFFSET ${offset}`)
    },
    bycountFulltextSearchPremium: (keyword) => {
        return db.load(`select count(*) as total from article where MATCH (title, description, catname, content) AGAINST('"${keyword}"') and (status='published' or (status='approved' and publish_at < '${today}'))`)
    },
    add: (entity) => {
        return db.add('article', entity);
    }
}
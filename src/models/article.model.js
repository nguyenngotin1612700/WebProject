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
    },
    byStatus:(status)=>{
        let sql = `select article.*, category.name from article join category on article.category_id = category.id  where status = '${status}' order by category.name ASC,article.create_at ASC`;
        return db.load(sql);
    },
    reject:(id,rejectMessage)=>{
        let sql = `update article set status = 'rejected', message_reject='${rejectMessage}' where id = ${id}`;
        return db.load(sql);
    },
    publish:(id,publishDate)=>{
        let sql = `update article set status = 'published', publish_at = '${publishDate}' where id = ${id}`;
        console.log(sql);
        return db.load(sql);
    },
    approved:(id,publishDate)=>{
        let sql = `update article set status = 'approved', publish_at='${publishDate}' where id = ${id}`;
        return db.load(sql);
    },
    byfulltextSearch: (keyword, limit, offset) => {
        return db.load(`select * from article where MATCH (title, description, catname, content) AGAINST('"${keyword}"') LIMIT ${limit} OFFSET ${offset}`)
    },
    bycountFulltextSearch: (keyword) => {
        return db.load(`select count(*) as total from article where MATCH (title, description, catname, content) AGAINST('"${keyword}"')`)
    }

}
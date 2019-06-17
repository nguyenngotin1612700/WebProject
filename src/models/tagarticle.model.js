var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from tagarticle');
    },
    allTag: () => {
        return db.load('select * from tag')
    },
    byarticleID: (id) => {
        return db.load(`select * from tagarticle join tag on id_article=${id} and tagarticle.id_tag = tag.id`);
    },
    byarticletagID: (id) => {
        return db.load(`select * from tagarticle join article on id_tag=${id} and tagarticle.id_article = article.id`);
    },
    bypagetagId: (tagID, limit, offset) => {
        return db.load(`select * from tagarticle join article on id_tag=${tagID} and tagarticle.id_article = article.id and article.ispremium=0 LIMIT ${limit} OFFSET ${offset}`)
    },
    bycounttagID: (tagID) => {
        return db.load(`select count(*) as total from tagarticle join article on id_tag=${tagID} and tagarticle.id_article = article.id and article.ispremium=0`)
    },
    bypagetagIdPremium: (tagID, limit, offset) => {
        return db.load(`select * from tagarticle join article on id_tag=${tagID} and tagarticle.id_article = article.id LIMIT ${limit} OFFSET ${offset}`)
    },
    bycounttagIDPremium: (tagID) => {
        return db.load(`select count(*) as total from tagarticle join article on id_tag=${tagID} and tagarticle.id_article = article.id`)
    },
    bytagID: (id) => {
        return db.load(`select name from tag where id=${id}`);
    },
    add: (entity) => {
        return db.add('tagarticle', entity);
    }
}
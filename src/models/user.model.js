let db = require('../utils/db');

module.exports ={
    add : (entity)=>{
        return db.add('user',entity);
    },
    singleByUsername : (username)=>{
        return db.singleByUsername(username);
    },
    allByRole : (role)=>{
        let sql = `select * from user where role = '${role}' and status='active'`;
        return db.load(sql);
    },
    allEditor: ()=>{
        let sql = `select user.*, category.id as categoryId, category.name as categoryName
        from user join category on user.manage_category = category.id 
        where role = 'editor' and status='active'`
        return db.load(sql);
    }
}
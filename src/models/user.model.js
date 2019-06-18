let db = require('../utils/db');

module.exports ={
    add : (entity)=>{
        return db.add('user',entity);
    },
    singleByUsername : (username)=>{
        return db.singleByUsername(username);
    },
    singleById: (id) => {
        return db.load(`select * from user where id=${id}`)
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
    },
    updateName:(name,id)=>{
        let sql = `update user set name='${name}' where id =${id}`;
        return db.load(sql);
    },
    updatePassword: (password,id)=>{
        let sql = `update user set password = '${password}' where id = ${id}`;
        return db.load(sql);
    },
    updateCategoryManage:(categoryManage,id)=>{
        let sql = `update user set manage_category = '${categoryManage}' where id = ${id}`;
        return db.load(sql);
    },
    renewUser:(expiry_date,id)=>{
        let sql = `update user set expiry_date = '${expiry_date}' where id = ${id}`;
        return db.load(sql);
    },
    InactiveUser:(id)=>{
        let sql = `update user set status = 'inactive' where id ='${id}'`;
        return db.load(sql);
    },
    update: (entity) => {
        return db.update('user', 'id', entity);
    }
}
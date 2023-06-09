const db = require('./db');


class mainPageModel {
    async count(tbName, idFieldName) {
        const condition = "";
        const res = await db.count(tbName, idFieldName, condition);
        return res;
    }

    async getPrice(sachId) {
        const condition = "";
        const res = await db.get('Sach', 'MaSach' , sachId);
        return res;
    }

    async load(tbName, idFieldName) {
        const res = await db.load(tbName, idFieldName);
        return res;
    }
}

module.exports = new mainPageModel;
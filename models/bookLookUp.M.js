const db = require('./db');
const tbName = 'Sach';
const idFieldName = 'MaSach';
class BookLookUpModel {

    async load() {
        const res = await db.load(tbName, idFieldName);
        return res;
    }
    
    async findBook (search) {
        const condition = `WHERE "TenSach" ILIKE '%${search}%' OR  "TacGia" ILIKE '%${search}%' OR "TheLoai" ILIKE '%${search}%'`;
        const res = await db.loadCondition(tbName, 'MaSach', condition);
        return res;
    }
}
module.exports = new BookLookUpModel;
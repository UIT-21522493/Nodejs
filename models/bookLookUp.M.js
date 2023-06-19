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

    async del(book) {
        const BookId = book.MaSach;
        const condition = `WHERE "MaSach" = ${BookId}`;
        const res = await db.del(tbName, condition);
        return res;
    }
}
module.exports = new BookLookUpModel;
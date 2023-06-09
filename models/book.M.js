const db = require('./db');
const tbName = 'Sach';
class BookModel {
    async all() {
        const res = await db.load(tbName, 'MaSach');
        return res;
    }
    async get (name, author) {
        const condition = `WHERE "TenSach" = '${name}' and "TacGia" = '${author}'`;
        const res = await db.loadCondition(tbName, 'MaSach', condition);
        return res;
    }
    async add(book) {
        const res = await db.add(tbName, book);
        return res;
    }
    async updateRest(id, rest) {
        const book = {
            MaSach: id,
            LuongTon: rest
        };
        const condition = `WHERE "MaSach" = ${id}`;
        const res = await db.patch(tbName, ['MaSach', 'LuongTon'], book, condition);
        return res;
    }
    async getById (id) {
        const condition = `WHERE "MaSach" = ${id}`;
        const res = await db.loadCondition(tbName, 'MaSach', condition);
        return res;
    }
}
module.exports = new BookModel;
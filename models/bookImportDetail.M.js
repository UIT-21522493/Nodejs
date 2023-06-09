const db = require('./db');
const tbName = 'ChiTietPhieuNhap';
class BookImportDetailModel {
    async add(bookImportDetail) {
        const res = await db.add(tbName, bookImportDetail);
        return res;
    }
    async getById (id) {
        const condition = `WHERE "MaCTPN" = ${id}`;
        const res = await db.loadCondition(tbName, 'MaCTPN', condition);
        return res;
    }
}
module.exports = new BookImportDetailModel;
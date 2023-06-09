const db = require('./db');

const tbName = 'ChiTietKhuyenMai';

class PromotionDetailModel {
    async getByBookId(bookId){
        const condition = `WHERE "MaSach" = ${bookId}`;
        const res = await db.loadCondition(tbName, 'MaCTKM', condition);
        return res;
    }

    async add(bookDetail) {
        const res = await db.add(tbName, bookDetail);
        return res;
    }
}
module.exports = new PromotionDetailModel;
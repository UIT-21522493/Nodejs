const db = require('./db');

const tbName = 'KhuyenMai';
const fieldName = ['LoaiKhuyenMai', 'LinkAnhKhuyenMai'];

class PromotionModel {
    async page(limit, offset) {
        const res = await db.loadPageofPromotion(tbName, limit, offset);
        return res;
    }

    async all(idFieldName) {
        const res = await db.load(tbName, idFieldName);
        return res;
    }

    async MaxId(idFieldName) {
        const res = await db.IdMax(tbName, idFieldName);
        return res[0];
    }

    async count(idFieldName) {
        const condition = "";
        const res = await db.count(tbName, idFieldName, condition);
        return res;
    }

    async add(promotion) {
        const res = await db.add(tbName, promotion);
        return res;
    }
    async getById(id){
        const condition = `WHERE "MaKM" = ${id}`;
        const res = await db.loadCondition(tbName, 'MaKM', condition);
        return res;
    }
    async loadBookIdCondition(id) {
        const condition = `WHERE "MaKM" = ${id}`;
        const res = await db.loadCondition('ChiTietKhuyenMai', 'MaCTKM', condition)
        return res;
    }

    async loadBookCondition(id) {
        const condition = `WHERE "MaSach" = ${id}`;
        const res = await db.loadCondition('Sach', 'MaSach', condition);
        return res;
    }
}
module.exports = new PromotionModel;
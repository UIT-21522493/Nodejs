const express = require('express'),
    router = express.Router(),
    customerModel = require('../models/customer.M'),
    debtModel = require('../models/debt.M'),
    bookModel = require('../models/book.M'),
    bookImportModel = require('../models/bookImport.M'),
    bookImportDetailModel = require('../models/bookImportDetail.M'),
    invoiceModel = require('../models/invoice.M'),
    invoiceDetailModel = require('../models/invoiceDetail.M');

router.get('/', (req, res) => {
    // Chặn, không cho vào trang khi chưa đăng nhập
    if (!req.user) return res.redirect('/');
    res.redirect('/report/inventory');
});

router.get('/inventory', (req, res) => {
    // Chặn, không cho vào trang khi chưa đăng nhập
    if (!req.user) return res.redirect('/');
    res.render('inventoryReport', {
        nav: () => 'navbar',
        active: { report: true }
    });
});

router.get('/debt', (req, res) => {
    // Chặn, không cho vào trang khi chưa đăng nhập
    if (!req.user) return res.redirect('/');
    res.render('debtReport', {
        nav: () => 'navbar',
        active: { report: true }
    });
});
router.post('/debt', async (req, res) => {
    const month = req.body.month;
    const year = req.body.year;
    console.log(req.body)
    const debts = await debtModel.getByTime(month, year);
    resultReport = await Promise.all(debts.map(async (debt) => {
        const customer = (await customerModel.getById(debt.MaKH))[0];
        const customerName = customer.HoTen;
        return{
            ...debt, 
            TenKhachHang: customerName
        }
    }));
    return res.render('debtReport', {
        nav: () => 'navbar',
        debt: true,
        debts: resultReport,
        empty: resultReport.length === 0,
        active: { report: true }
    });
}); 
router.post('/inventory', async (req, res) => {
    const month = req.body.month;
    const year = req.body.year;

    const bookImports = await bookImportModel.getByTime(month, year);
    bookImportDetails = [];
    for(let i = 0; i < bookImports.length; i++){
        const bookImportDetail = await bookImportDetailModel.getById(bookImports[i].MaSach);
        bookImportDetails.push(...bookImportDetail);
    };
    bookImportRes = bookImportDetails.reduce((acc, val) => {
        const o = acc.filter(obj => {
            return obj.MaSach==val.MaSach;
        }).pop() || {MaSach:val.MaSach, SoLuong:0};
        o.SoLuong += val.SoLuong;
        if(o.SoLuong !== val.SoLuong){
            for(let i = 0; i < acc.length; i++){
                if(acc[i].MaSach == val.MaSach){
                    acc[i].SoLuong = o.SoLuong;
                }
            }
        }
        else
            acc.push(o);
        return acc;
    },[]);
    idSachs = new Set(bookImportRes.map(e => e.MaSach));
    console.log(idSachs);
    const invoices = await invoiceModel.getByTime(month, year);
    invoiceDetails = [];
    for(let i = 0; i < invoices.length; i++){
        const invoiceDetail = await invoiceDetailModel.getById(invoices[i].SoHD);
        invoiceDetails.push(...invoiceDetail);
    };
    invoiceRes = invoiceDetails.reduce((acc, val) => {
        const o = acc.filter(obj => {
            return obj.MaSach==val.MaSach;
        }).pop() || {MaSach:val.MaSach, SoLuong:0};
        o.SoLuong += val.SoLuong;
        if(o.SoLuong !== val.SoLuong){
            for(let i = 0; i < acc.length; i++){
                if(acc[i].MaSach == val.MaSach){
                    acc[i].SoLuong = o.SoLuong;
                }
            }
        }
        else
            acc.push(o);
        return acc;
    },[]);
    invoiceRes = invoiceRes.filter(e => idSachs.has(e.MaSach));
    invoiceResLength = invoiceRes.length;
    idSachs.forEach(idSach =>{
        let isExisted = false;
        for(let i = 0; i < invoiceResLength; i++){
            if(invoiceRes[i].MaSach == idSach){
                isExisted = true;
            }
        }
        if(!isExisted){
            invoiceRes.push({MaSach: idSach, SoLuong: 0});
        }
    })

    resultReport = bookImportRes.map(e => {
        output = 0;
        for(let i = 0; i < invoiceRes.length; i++){
            if(e.MaSach == invoiceRes[i].MaSach){
                output = invoiceRes[i].MaSach;
                break;
            }
        }
        return {MaSach: e.MaSach, input: e.SoLuong, output: output}
    })
    resultReport = resultReport.map(e => {
        return {...e, inventory: e.input - e.output};
    })
    resultReport = await Promise.all(resultReport.map(async (e) => {
        const book = (await bookModel.getById(e.MaSach))[0];
        const bookName = book.TenSach;
        return{
            ...e, 
            TenSach: bookName
        }
    }));
    return res.render('inventoryReport', {
        nav: () => 'navbar',
        inventory: true,
        inventories: resultReport,
        empty: resultReport.length === 0,
        active: { report: true }
    });
}); 
module.exports = router;
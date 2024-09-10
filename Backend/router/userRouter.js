const express = require('express')
const router = express.Router()
const userCtrl = require('../controller/userCtrl')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files


router.post('/Posorder', userCtrl.PosOrder);
router.post('/WhatsappOrder', userCtrl.onlineOrder);
router.get('/Whatsappget', userCtrl.fetchOnlineOrder)
router.get('/PosOrder', userCtrl.getOrders);
router.post('/createCategory', userCtrl.category)
router.get('/getCategory', userCtrl.getCategory)
router.post('/addCustomer', userCtrl.addCustomer)
router.get('/getCustomer', userCtrl.getCustomer);
router.put('/orders/:id/status',userCtrl.statusUpdate)
router.post('/printreceipt', userCtrl.handleReciptprinter)
router.post('/Onlinecustomer',userCtrl.onlineCustomer)
router.patch('/PaymentStatus/:id', userCtrl.paymentStatus);
router.post('/importexcel', upload.single('file'),userCtrl.ImportExcel);
router.get('/ExcelItems',userCtrl.SheetDataGet)
router.post('/salesPrint',userCtrl.printOrderReceipt)
router.post('/createEmploye',userCtrl.createEmploye)
router.get('/getEmploye',userCtrl.getEmploye)
router.post('/createFloor',userCtrl.createFloor)
router.get('/getFloor',userCtrl.getFloor)
router.post('/createTable',userCtrl.createTable)
router.get('/:floorId/tables', userCtrl.getTablesByFloor);



     
module.exports = router        
const express = require('express')
const router = express.Router()
const userCtrl = require('../controller/userCtrl')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files


router.post('/Posorder', userCtrl.PosOrder);
router.post('/WhatsappOrder', userCtrl.onlineOrder);
router.post('/customerOnline',userCtrl.customerOnlineorder)
router.post('/Logout',userCtrl.adminLogout)
router.post('/protacted',userCtrl.AdminProtacted)
router.post('/Signup',userCtrl.AdminSignup)
router.post('/login',userCtrl.AdminLogin)
router.get('/Whatsappget', userCtrl.fetchOnlineOrder)
router.get('/PosOrder', userCtrl.getOrders);
router.post('/createCategory', userCtrl.category)
router.get('/getCategory', userCtrl.getCategory)
router.post('/addCustomer', userCtrl.addCustomer)
router.get('/getCustomer', userCtrl.getCustomer);
router.put('/orders/:id/status',userCtrl.statusUpdate)
router.post('/Onlinecustomer',userCtrl.onlineCustomer)
router.patch('/PaymentStatus/:id', userCtrl.paymentStatus);
router.post('/importexcel', upload.single('file'),userCtrl.ImportExcel);
router.get('/ExcelItems',userCtrl.SheetDataGet)    
router.post('/createEmploye',userCtrl.createEmploye)                                 
router.get('/getEmploye',userCtrl.getEmploye)
router.post('/createFloor',userCtrl.createFloor)
router.get('/getFloor',userCtrl.getFloor)
router.post('/WaiterOder',userCtrl.addWaiterOrder)
router.get('/getWaIterOder',userCtrl.getWaIterOder)
router.get('/:tableId/getWaiterOrder',userCtrl.getWaiterOrderTablesId)
router.post('/:tableId/BlockedTable',userCtrl.blockTable)
router.post("/createPosItem/:deviceId", userCtrl.POSItem);
router.get('/:deviceId/getPosItems', userCtrl.getPosItemsByDevice);
router.post('/Devices',userCtrl.ItemDevices)
router.get('/AllDevices',userCtrl.getDevices)
router.post('/:floorId/createTable',userCtrl.createTable)
router.get('/:floorId/getTables', userCtrl.getTablesByFloor);
router.post('/addItem',userCtrl.addSheetItem)
router.put('/waiter-order/:oderId',userCtrl.editWaiterOrder);
router.get('/getAllTables',userCtrl.getAllTables)
router.delete('/DeleteWaiterOrder/:oderId',userCtrl.DeleteWaiterOrder)

     
module.exports = router        
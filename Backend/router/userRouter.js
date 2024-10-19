const express = require('express')
const router = express.Router()
const userCtrl = require('../controller/userCtrl')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files



// POS frondent Orders
router.post('/Posorder', userCtrl.PosOrder);
router.get('/PosOrder', userCtrl.getOrders);


// Whatssapp Orders intgrate XpressBot
router.post('/WhatsappOrder', userCtrl.whatsAPPonlineOrder);
router.get('/Whatsappget', userCtrl.fetchOnlineOrder)
router.put('/orders/:id/status',userCtrl.statusUpdate)
router.patch('/PaymentStatus/:id', userCtrl.paymentStatus);



//CustomerOnline APPlication Orders 
router.post('/customerOnline',userCtrl.customerOnlineorder)
router.patch('/CustomerStatus/:id', userCtrl.StatusChange);
router.get('/getOnlineorder', userCtrl.getCustomerOrder)
router.delete('/deleteCustomer/:customerId', userCtrl.deleteCustomerOnline)
router.put('/EditOrders/:customerId', userCtrl.CustomerOnlineItemsEdit)



// ItemTaxe
router.delete('/DeleteTax/:TaxeID', userCtrl.DeleteTax)
router.post('/CreateTax', userCtrl.createTax)
router.get('/getTaxes',userCtrl.getTax)
router.put('/editTax/:TaxeID', userCtrl.EditTaxes)




// Admin Authentication
router.post('/Logout',userCtrl.adminLogout)
router.post('/protacted',userCtrl.AdminProtacted)
router.post('/Signup',userCtrl.AdminSignup)
router.post('/login',userCtrl.AdminLogin)



// Category
router.post('/createCategory', userCtrl.category)
router.get('/getCategory', userCtrl.getCategory)

// Customer
router.post('/addCustomer', userCtrl.addCustomer)
router.get('/getCustomer', userCtrl.getCustomer);


// Item Devices
router.get('/:deviceId/getPosItems', userCtrl.getPosItemsByDevice);
router.post('/AddDevices',userCtrl.ItemDevices)
router.get('/AllDevices',userCtrl.getDevices)
router.delete('/deleteDevices/:devicesId', userCtrl.deleteDevice)
router.put('/EditDevices/:DeviceId',userCtrl.EditDevices)




// Aditional Servicess Like Excel
router.post('/importexcel', upload.single('file'),userCtrl.ImportExcel);
router.get('/ExcelItems',userCtrl.SheetDataGet) 
router.post('/addItem',userCtrl.addSheetItem)




// Employess
router.post('/createEmploye',userCtrl.createEmploye)                                 
router.get('/getEmploye',userCtrl.getEmploye)


// Create Floor
router.post('/createFloor',userCtrl.createFloor)
router.get('/getFloor',userCtrl.getFloor)


// WaiterOrders
router.post('/WaiterOder',userCtrl.addWaiterOrder)
router.get('/getWaIterOder',userCtrl.getWaIterOder)
router.get('/:tableId/getWaiterOrder',userCtrl.getWaiterOrderTablesId)
router.put('/waiter-order/:oderId',userCtrl.editWaiterOrder);
router.delete('/DeleteWaiterOrder/:oderId',userCtrl.DeleteWaiterOrder)


// Tables
router.post('/:tableId/BlockedTable',userCtrl.blockTable)
router.post('/:floorId/createTable',userCtrl.createTable)
router.get('/:floorId/getTables', userCtrl.getTablesByFloor);
router.get('/getAllTables',userCtrl.getAllTables)


// Create POS frondent Items
router.post("/createPosItem/:deviceId", userCtrl.POSItem);





     
module.exports = router        
const express = require('express')
const router = express.Router()
const userCtrl = require('../controller/userCtrl')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files



// POS frondent Orders
router.post('/Posorder', userCtrl.PosOrder);
router.get('/PosOrder', userCtrl.getOrders);



// Online Platform Oders
router.post('/OnlineOrder', userCtrl.processOrder)
router.get('/OnlineOrderget', userCtrl.fetchOnlineOrder)
router.patch('/CustomerStatus/:id', userCtrl.StatusChange);
router.delete('/deleteOnlineOrder/:Id', userCtrl.deleteCustomerOnline)
router.put('/EditOrders/:Id', userCtrl.CustomerOnlineItemsEdit)



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
router.post('/Importexcel/Melparamba', upload.single('file'),userCtrl.ImportExcel);
router.post('/Importexcel/Naimarmoola', upload.single('file'),userCtrl.ImportExcel);
router.post('/Importexcel/Theruvath', upload.single('file'),userCtrl.ImportExcel);


router.get('/ExcelItems',userCtrl. ALLItemsGet) 
router.post('/addItem',userCtrl.addSheetItem)
// Create POS frondent Items
router.post("/createPosItem/:deviceId", userCtrl.POSItem);





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






     
module.exports = router        
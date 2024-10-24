const POSorder = require("../Model/userModel");
const Category = require("../Model/Categorymodel");
const EmployeSchema = require("../Model/Employemodel");
const Customer = require("../Model/Customermodel");
const Floor = require("../Model/Floormodel");
const Table = require("../Model/Hometablemodel");

const { Melparamba, Theruvath, Nayamaramoola } = require("../Model/ALLItemsmodel"); // Adjust the path accordingly

const Waiter = require("../Model/Waiterodermodel");
const TaxItem = require("../Model/ItemTaxmodel");
const ItemDevices = require("../Model/DeviceModel");
const Admin = require("../Model/Signupmodel");
const POSItems = require("../Model/ALLItemsmodel");
const onlineOrders = require("../Model/OnlinePlatfromOrders");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
const moment = require("moment-timezone");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const XLSX = require("xlsx");
const mongoose = require("mongoose");
require("dotenv").config();

const jwtSecret = process.env.TOKEN_SECRET_KEY;

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  PosOrder: async (req, res) => {
    try {
      const { orderDetails, itemDetails, discount, type } = req.body; // Include `type` in the destructuring

      // Convert current date and time to IST and store it in UTC
      const orderDate = moment().tz("Asia/Kolkata").utc().format();

      // Create a new order using the POSorder model
      const newOrder = new POSorder({
        itemDetails: {
          items: itemDetails.items,
          itemName: itemDetails.itemName,
          quantity: itemDetails.quantity,
          method: itemDetails.method,
          total: itemDetails.total,
        },
        orderDetails: {
          paymentStatus: orderDetails.paymentStatus,
          orderNumber: orderDetails.orderNumber,
          invoiceNumber: orderDetails.invoiceNumber,
          customerName: orderDetails.customerName,
          location: orderDetails.location,
          orderDate: orderDate,
        },
        discount: {
          type: discount.type,
          value: discount.value,
        },
        type: type, // Include `type` here
      });

      // Save the order to the database
      await newOrder.save();
      console.log(newOrder, "newOrder");

      // Send a success response
      return res.status(201).json({
        message: "PosOrder created successfully",
        order: newOrder,
      });
    } catch (error) {
      // Handle errors and send a failure response
      return res.status(500).json({
        message: "Error creating order",
        error: error.message,
      });
    }
  },

  getOrders: async (req, res) => {
    try {
      const orders = await POSorder.find({});
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error retrieving orders:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // OnlinePlatfromOrders

  processOrder: async (req, res) => {
    try {
      const { OrderType, ...orderData } = req.body;

      if (OrderType === "customerOnlineOrder") {
        // Process Customer Online Order
        const {
          Items,
          Id,
          OnlineorderDate,
          totalAmount,
          orderStatus,
          customerName,
          customerPhone,
          orderNotes,
          OrderType
        } = orderData;  // Make sure these values exist
        
        const customerOrderData = {
          Items,
          Id,
          OnlineorderDate,
          totalAmount,
          orderStatus,
          customerName,
          customerPhone,
          orderNotes,
          OrderType
        };

        const newCustomerOnlineOrder = new onlineOrders({
          customerOnlineOrder: [customerOrderData], // Wrap in an array if you expect multiple orders
          orderType: "customerOnlineOrder",
      });


        await newCustomerOnlineOrder.save();

        // Broadcast to WebSocket clients
        const wss = req.app.get("wss");
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(newCustomerOnlineOrder));
          } 
        });

        return res.status(201).json({
          message: "Customer Online Order created successfully",
          order: newCustomerOnlineOrder,
        });

      }else if (OrderType === "whatsappOnlineOrder"){
        // Process WhatsApp Online Order
        const {
          order_id,
          catalog_id,
          payment_method,
          cart_total,
          customer_name,
          customer_phone_number,
          payment_status,
          item_lines,
          OrderType
        } = orderData;  // Make sure these values exist
        
        // // Logging received data
        // console.log("WhatsApp Order Data:", {
        //   order_id,
        //   catalog_id,
        //   payment_method,
        //   cart_total,
        //   customer_name,
        //   customer_phone_number,
        //   payment_status,
        //   item_lines,
        // });
        


        // Map the item_lines to orderDetails
        const orderDetails = item_lines.map((item) => ({
          product_name: item.product_name,
          product_quantity: item.product_quantity,
          product_currency: item.product_currency,
          unit_price: item.unit_price,
        }));

        

        // Convert current date and time to IST
        const orderDate = moment().tz("Asia/Kolkata").format();

        const whatsappOrderData = {
          orderDetails: orderDetails,
          OrderType:OrderType,
          orderMeta: {
            posOrderId: order_id, // This is a string
            orderType: catalog_id,
            paymentMethod: payment_method,
            paymentTendered: cart_total, // Make sure this is a number
            orderDate: orderDate,
            paymentStatus: payment_status,
            orderStatus: "Pending",
          },
          customer: {
            name: customer_name,
            phone: customer_phone_number,
          },
        };
        
        console.log("WhatsApp Order Data:", whatsappOrderData);


      const newWhatsAppOrder = new onlineOrders({
        whatsappOnlineOrder: [whatsappOrderData], // Wrap in an array if you expect multiple orders
        orderType: "whatsappOnlineOrder",
      });
      
 
      

    await newWhatsAppOrder.save();


        // Broadcast to WebSocket clients
        const wss = req.app.get("wss");
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(whatsappOrderData));
          }
        });

        return res.status(200).json({
          message: "WhatsApp Order processed successfully",
          order: whatsappOrderData,
        }); 
      }else{
        return res.status(400).json({
          message: "Invalid OrderType. Expected 'AppOrder' or 'whtsappOrder'.",
        });
      }
    } catch (error) {
       console.log(error);
       
    }
  },

  // Fetch OnlineOrders  Endpoint

  fetchOnlineOrder: async (req, res) => {
    try {
      const Orders = await onlineOrders.find(
        {},
        { customerOnlineOrder: 1, whatsappOnlineOrder: 1 }  // Include both order types in the query
      );

      if (!Orders.length) {
        return res
          .status(404)
          .json({ message: "No Whatsapp online orders found." });
      }

      return res.status(200).json( Orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching orders", error });
    }
  },

  // Add category

  category: async (req, res) => {
    const {
      categoryName,
      arabicName,
      description,
      arabicDescription,
      enterPosition,
    } = req.body;
    try {
      // Create a new category instance

      const newCategory = new Category({
        categoryName,
        arabicName,
        description,
        arabicDescription,
        enterPosition,
      });

      const savedCategory = await newCategory.save();

      res.status(201).json({
        success: true,
        data: savedCategory,
        message: "Category created successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // get Category

  getCategory: async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json({ categories });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  },

  // Add Customer

  addCustomer: async (req, res) => {
    const { name, place, number } = req.body;

    // Convert current date and time to IST
    const customeraddDate = moment().tz("Asia/Kolkata").toDate(); // Use .toDate() to get a JavaScript Date object

    try {
      // Check if a customer with the same name or number already exists
      const existingCustomer = await Customer.findOne({
        $or: [{ name }, { number }],
      });

      if (existingCustomer) {
        return res.status(400).json({
          message: "Customer already exists",
        });
      }

      // Create a new customer
      const newCustomer = new Customer({
        name,
        place,
        number,
        customeraddDate, // Include the orderDate in the customer object
      });

      // Save the customer to the database
      await newCustomer.save();

      // Send a success response
      res.status(201).json({
        message: "Customer added successfully",
        customer: newCustomer,
      });
    } catch (error) {
      // Handle errors and send a failure response
      res.status(500).json({
        message: "Failed to add customer",
        error: error.message,
      });
    }
  },
  // get customer

  getCustomer: async (req, res) => {
    try {
      // Retrieve all customers from the database
      const customers = await Customer.find();

      // Send a success response with the list of customers
      res.status(200).json({
        message: "Customers retrieved successfully",
        customers,
      });
    } catch (error) {
      // Handle errors and send a failure response
      res.status(500).json({
        message: "Failed to retrieve customers",
        error: error.message,
      });
    }
  },

  
 
  // CustomerOnlineOrderStatus change

  StatusChange: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const validStatuses = [
        "Placed",
        "Confirmed",
        "Ready",
        "Completed",
        "Dispatched",
        "Assigned",
        "Printed",
        "Delivered",
        "cancelled",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid order status!" });
      }

      // find Order By ID

      const Order = await onlineOrders.findById(id);
      // Check if the order exists
      if (!Order) {
        return res.status(404).json({ message: "Order not found!" });
      }

      if (Order.customerOnlineOrder && Order.customerOnlineOrder.length > 0) {
        Order.customerOnlineOrder[0].orderStatus = status;
      } else {
        return res.status(400).json({ message: "No customer order found!" });
      }

      // Save the updated order
      await Order.save();
     
      res
        .status(200)
        .json({ message: "Order status updated successfully!", Order });
    } catch (error) {
      // Handle any errors
      res
        .status(500)
        .json({ message: "Error updating order status", error: error.message });
    }
  },







  // ExcelSheet datas

  ImportExcel: async (req, res) => {
    try {
      if (!req.file) return res.status(400).send("No file uploaded.");

      // Read the uploaded file
      const workbook = XLSX.readFile(req.file.path);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      console.log(data);

      let model;
      switch (req.originalUrl) {
        case '/api/admin/Importexcel/Melparamba':
          model = Melparamba;
          break;
        case '/api/admin/Importexcel/theruvath':
          model = Theruvath;
          break;
        case '/api/admin/Importexcel/nayamaramoola':
          model = Nayamaramoola;
          break;
        default:
          return res.status(400).send("Invalid endpoint.");
      }


      
      // Save data to database
      for (const item of data) {
        await model.create(item);
      }

      res.status(200).send("File processed and data saved.");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing file.");
    }
  },



  // getExcelSheet datas

  ExcelItemsGet: async (req, res) => {
    try {
      let model;
      switch (req.originalUrl) {
        case '/api/admin/getExcel/Melparamba':
          model = Melparamba;
          break;
        case '/api/admin/getExcel/theruvath':
          model = Theruvath;
          break;
        case '/api/admin/getExcel/nayamaramoola':
          model = Nayamaramoola;
          break;
        default:
          return res.status(400).send("Invalid endpoint.");
      }
  
      // Fetch items from the appropriate model
      const items = await model.find();
      res.status(200).json(items);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving items.");
    }
  },



  // Employe create
  createEmploye: async (req, res) => {
    try {
      const {
        name,
        password,
        fourDigitPasscode,
        sixDigitPasscode,
        type,
        email,
        phone,
        roles,
        location,
      } = req.body;
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const createEmployeeDate = moment().tz("Asia/Kolkata").format();

      // Create a new employee instance
      const newEmployee = new EmployeSchema({
        name,
        password: hashedPassword,
        fourDigitPasscode,
        sixDigitPasscode,
        type,
        email,
        phone,
        roles,
        location,
        createEmployeeDate, // Store the current date in UTC
      });
      // Save the employee to the database
      await newEmployee.save();

      return res.status(201).json({
        message: "Employee created successfully",
        employee: newEmployee,
      });
    } catch (error) {
      console.error("Error creating employee:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  },

  // get Employssss

  getEmploye: async (req, res) => {
    try {
      const EmployeData = await EmployeSchema.find();
      res.status(200).json(EmployeData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving items.");
    }
  },

  // create Floor

  createFloor: async (req, res) => {
    try {
      const { name, location, gratuity, minimumPartySize } = req.body;

      const createFloorDate = moment().tz("Asia/Kolkata").format();

      // Create new floor
      const newFloor = new Floor({
        name,
        location,
        gratuity,
        minimumPartySize,
        createFloorDate,
      });

      await newFloor.save();
      return res
        .status(201)
        .json({ message: "Floor created successfully", floor: newFloor });
    } catch (error) {
      return res.status(500).json({ message: "Error creating floor", error });
    }
  },
  // get Floor

  getFloor: async (req, res) => {
    try {
      const FloorData = await Floor.find();
      res.status(200).json(FloorData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving items.");
    }
  },

  // create Table

  // Create Table with floor association
  createTable: async (req, res) => {
    try {
      const { floorId } = req.params; // Get the floorId from the URL params
      const { name, tableNumber, seatingCapacity, priceCategory } = req.body;

      console.log("Request Body:", req.body);

      // Ensure that all required fields are provided
      if (!name || !tableNumber || !seatingCapacity || !priceCategory) {
        return res.status(400).json({
          message:
            "All fields (name, tableNumber, seatingCapacity, priceCategory) are required.",
        });
      }

      const existingTable = await Table.findOne({ tableNumber });
      if (existingTable) {
        return res.status(400).json({
          message:
            "Table number already exists. Please use a different table number.",
        });
      }

      // Find the floor by floorId
      const floor = await Floor.findById(floorId);
      if (!floor) {
        return res.status(404).json({ message: "Floor not found" });
      }

      // Create the table and associate it with the floor
      const newTable = new Table({
        name,
        tableNumber, // Include tableNumber here
        seatingCapacity,
        priceCategory,
        floor: floor._id, // Associate the table with the floor's ID
      });

      // Save the new table to the database
      const savedTable = await newTable.save();

      // Respond with the newly created table
      res.status(201).json({
        message: "Table created successfully",
        data: savedTable,
      });
    } catch (error) {
      console.error("Error creating table:", error);
      res.status(500).json({
        message: "An error occurred while creating the table",
        error: error.message,
      });
    }
  },

  blockTable: async (req, res) => {
    try {
      const { tableId } = req.params;
      const { isBlocked } = req.body;

      // Find the table by its ID

      const table = await Table.findById(tableId);
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }
      // Update the isBlocked status of the table
      table.isBlocked = isBlocked;
      // Save the updated table to the database
      const updatedTable = await table.save();
      res.status(200).json({
        message: `Table ${isBlocked ? "blocked" : "unblocked"} successfully`,
        data: updatedTable,
      });
    } catch (error) {
      console.error("Error blocking/unblocking table:", error);
      res.status(500).json({
        message: "An error occurred while updating the table status",
        error: error.message,
      });
    }
  },

  getTablesByFloor: async (req, res) => {
    try {
      const { floorId } = req.params;

      // Fetch all tables that belong to the provided floor ID and populate the floor's name
      const tables = await Table.find({ floor: floorId }).populate(
        "floor",
        "name"
      ); // Populate the 'floor' field, selecting only the 'name'

      if (!tables || tables.length === 0) {
        return res
          .status(404)
          .json({ message: "No tables found for this floor" });
      }

      // Return the list of tables with the floor's name included
      res.status(200).json({
        message: "Tables fetched successfully",
        data: tables,
      });
    } catch (error) {
      console.error("Error fetching tables:", error);
      res.status(500).json({
        message: "An error occurred while fetching tables",
        error: error.message,
      });
    }
  },

  // getAllTables

  getAllTables: async (req, res) => {
    try {
      const getAllTables = await Table.find();
      res.status(200).json({ data: getAllTables }); // Wrap response in an object with "data" field
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching tables" });
    }
  },



 
  // POSItemscreate

  POSItem: async (req, res) => {
    try {
      const { deviceId } = req.params; // Extract deviceId from params
      const {
        ID,
        Itemname,
        price,
        MRP,
        category,
        deviceName,
        description,
        alternateDescription,
        ItemnameVariation,
        alternateItemnameVariation,
        foodType,
        shortCode,
        barCode,
        alternateName,
        itemPosition,
      } = req.body; // Extract deviceName from body

      // Check if the item with the same code already exists
      const existingItem = await POSItems.findOne({ shortCode });
      if (existingItem) {
        return res
          .status(400)
          .json({ msg: "Item with this code already exists" });
      }

      // Find the device by deviceId
      const device = await ItemDevices.findById(deviceId); // Look up the device
      if (!device) {
        return res.status(404).json({ msg: "Device not found" });
      }

      // Create a new POS item and associate the device name from the request body
      const newItem = new POSItems({
        ID,
        Itemname,
        price,
        MRP,
        category,
        ItemnameVariation,
        foodType,
        shortCode,
        description,
        alternateDescription,
        alternateItemnameVariation,
        barCode,
        alternateName,
        itemPosition,
        device: deviceName, // Save the device name from the body
        deviceId: device._id, // Save the device ID from the database
      });

      // Save the item to the database
      await newItem.save();

      res
        .status(201)
        .json({ msg: "POS Item created successfully", item: newItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server Error" });
    }
  },





  // getPosItemsAll

  getPosItemsByDevice: async (req, res) => {
    try {
      const { deviceId } = req.params; // Get device ID from URL params
      const POSItemsFiltered = await POSItems.find({ deviceId }); // Filter items by device ObjectId
      res.status(200).json(POSItemsFiltered);
    } catch (error) {
      console.error("Error retrieving filtered items:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // create a ItemDevices

  ItemDevices: async (req, res) => {
    try {
      const { Name, Location, Devices, IPAddress } = req.body;

      const generateRandomID = () => {
        return Math.floor(10000 + Math.random() * 90000);
      };

      const generateRandomCode = () => {
        return Math.random().toString(36).substr(2, 8).toUpperCase();
      };

      if (!Name || !Location || !Devices) {
        return res.status(400).json({ msg: "All fields are required" });
      }

      const DevicesCreateDate = moment().tz("Asia/Kolkata").format();
      const ID = generateRandomID();
      const Code = generateRandomCode();

      // Create a new ItemDevices document
      const KdsDevices = new ItemDevices({
        Name,
        Location,
        Devices,
        IPAddress,
        DevicesCreateDate,
        ID,
        Code,
      });

      // Save the document to the database
      await KdsDevices.save();

      return res.status(201).json({
        msg: "Device successfully added",
        KdsDevices,
      });
    } catch (error) {
      console.error("Error saving the device:", error);
      return res.status(500).json({
        msg: "Server error, please try again later",
        error: error.message,
      });
    }
  },

  // Devicess Delete

  deleteDevice: async (req, res) => {
    const { devicesId } = req.params;
    try {
      const deviceDelete = await ItemDevices.findByIdAndDelete(devicesId);
      if (!deviceDelete) {
        return res.status(404).json({ message: "Devices Note found" });
      }
      return res.status(200).json({ message: "Devices Deleted Successfuly" });
    } catch (error) {
      res.status(500).send("Error Deleted Devicess.");
    }
  },

  // get ItemDevices All

  getDevices: async (req, res) => {
    try {
      const AllDevices = await ItemDevices.find();
      res.status(200).json(AllDevices);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving itemsDevices.");
    }
  },

  // Edit Devices

  EditDevices: async (req, res) => {
    const { DeviceId } = req.params;
    try {
      const { Name, Location, Devices, IPAddress } = req.body;

      // Find the waiter order by its ID and wait for the result
      const devicess = await ItemDevices.findById(DeviceId);

      if (!devicess) {
        return res.status(404).json({
          message: "Devices not found",
        });
      }

      devicess.Name = Name || devicess.Name;
      devicess.Location = Location || devicess.Location;
      devicess.Devices = Devices || devicess.Devices;
      devicess.IPAddress = IPAddress || devicess.IPAddress;

      // Save the updated order
      await devicess.save();

      // Send a success response
      res.status(200).json({
        message: "devicess updated successfully",
        devicess,
      });
    } catch (error) {
      console.log(error);
    }
  },

  // POST request to add a new waiter entry

  addWaiterOrder: async (req, res) => {
    try {
      // Destructure data from the request body
      const {
        billnumber,
        tableIds, // These should now be ObjectIds
        items,
        subTotal,
        tax,
        total,
        orderStatus,
        customerName,
        priceCategory,
      } = req.body;

      const OdercreateDate = moment().tz("Asia/Kolkata").format();
      // Create a new Waiter instance
      const newWaiterOrder = new Waiter({
        billnumber,
        OdercreateDate,
        tableIds, // Store ObjectIds here
        items,
        subTotal,
        tax,
        total,
        orderStatus,
        customerName,
        priceCategory,
      });
      // Save the new order to the database
      await newWaiterOrder.save();

      // Broadcast the new order to WebSocket clients (optional)
      const wss = req.app.get("wss");
      if (wss) {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(newWaiterOrder));
          }
        });
      }

      // Send a success response
      res.status(201).json({
        message: "New waiter order added successfully",
        waiterOrder: newWaiterOrder,
      });
    } catch (error) {
      console.error("Error adding waiter order:", error);
      res.status(500).json({
        message: "Failed to add waiter order",
        error: error.message,
      });
    }
  },

  // Edit waiter oder

  editWaiterOrder: async (req, res) => {
    try {
      const { oderId } = req.params; // If the route is defined with :oderId

      console.log("Order ID:", oderId); // Debugging step to check oderId

      const {
        billnumber,
        tableIds, // These should now be ObjectIds
        items,
        subTotal,
        tax,
        total,
        orderStatus,
        customerName,
        priceCategory,
      } = req.body;

      // Find the waiter order by its ID and wait for the result
      const waiterOrder = await Waiter.findById(oderId);

      if (!waiterOrder) {
        return res.status(404).json({
          message: "Waiter order not found",
        });
      }

      // Update the order fields with the new values
      waiterOrder.billnumber = billnumber || waiterOrder.billnumber;
      waiterOrder.tableIds = tableIds || waiterOrder.tableIds; // Update only if provided
      waiterOrder.items = items || waiterOrder.items;
      waiterOrder.subTotal = subTotal || waiterOrder.subTotal;
      waiterOrder.tax = tax || waiterOrder.tax;
      waiterOrder.total = total || waiterOrder.total;
      waiterOrder.orderStatus = orderStatus || waiterOrder.orderStatus;
      waiterOrder.customerName = customerName || waiterOrder.customerName;
      waiterOrder.priceCategory = priceCategory || waiterOrder.priceCategory;

      // Save the updated order
      await waiterOrder.save();

      // Send a success response
      res.status(200).json({
        message: "Waiter order updated successfully",
        waiterOrder,
      });
    } catch (error) {
      console.error("Error editing waiter order:", error);
      res.status(500).json({
        message: "Failed to edit waiter order",
        error: error.message,
      });
    }
  },

  // WaiterOrder

  DeleteWaiterOrder: async (req, res) => {
    const { oderId } = req.params; // If the route is defined with :oderId
    try {
      const waiterOrderDelete = await Waiter.findByIdAndDelete(oderId);
      if (!waiterOrderDelete) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting order", error });
    }
  },

  // getWaIterOder

  getWaIterOder: async (req, res) => {
    try {
      const WaIterOder = await Waiter.find();
      res.status(200).json(WaIterOder);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving items.");
    }
  },

  // getWaiterOrderTablesId

  getWaiterOrderTablesId: async (req, res) => {
    try {
      const { tableId } = req.params;

      // Fetch orders where the provided tableId exists in the tableIds array
      const orders = await Waiter.find({ tableIds: tableId });

      if (!orders || orders.length === 0) {
        return res
          .status(404)
          .json({ message: "No orders found for this table ID" });
      }

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders", error });
    }
  },

  // Admin Register

  AdminSignup: async (req, res) => {
    try {
      const { selectBusinessType, email, phoneNumber, password } = req.body;

      // Check if admin already exists (to avoid duplicates)
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res
          .status(400)
          .json({ message: "Admin with this email already exists." });
      }

      // // Hash password before saving
      // const hashedPassword = await bcrypt.hash(password, 10);
      // // New Database Document create

      const newAdminRegister = new Admin({
        selectBusinessType: selectBusinessType,
        email: email,
        phoneNumber: phoneNumber,
        password,
      });

      // Save to database
      await newAdminRegister.save();

      // Send response back to the client
      res.status(201).json({
        message: "Admin registered successfully",
        admin: {
          selectBusinessType: newAdminRegister.selectBusinessType,
          email: newAdminRegister.email,
          phoneNumber: newAdminRegister.phoneNumber,
        },
      });
    } catch (error) {
      console.error("Error during admin signup:", error);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },

  // AdminLogin

  AdminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // console.log(req.body, "req.body");

      // Check if Admin exists
      const admin = await Admin.findOne({ email });
      // console.log("Admin from DB:", admin);

      if (!admin) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      // console.log("Provided password:", password);
      // console.log("Stored hashed password:", admin.password);

      // Check if the password is present in the admin document
      if (!admin.password) {
        return res
          .status(400)
          .json({ message: "Password not set for this admin." });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      // console.log("Password valid:", isPasswordValid);

      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ error: "error", message: "Incorrect password 🔐" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: admin._id, isAdmin: true }, // Payload
        jwtSecret,
        { expiresIn: "1h" } // Token expiry
      );

      // Send success response with token
      return res.status(200).json({
        message: "Login successful",
        token,
        admin: {
          email: admin.email,
          phoneNumber: admin.phoneNumber,
          selectBusinessType: admin.selectBusinessType,
        },
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      return res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },

  // Admin Logout

  adminLogout: async (req, res) => {
    try {
      res
        .status(200)
        .json({ success: true, message: "Admin logged out successfully" });
    } catch (error) {
      console.error(error); // Better practice to use console.error for logging errors
      res.status(500).json({
        success: false,
        message: "An error occurred while logging out.",
      });
    }
  },

  // Protacted Route

  AdminProtacted: async (req, res) => {
    res.status(200).json({
      success: true,
      message: "You are accessing a protected route!",
    });
  },

  // CustomerOnlineorder


  // deleteCustomerOnlineAll

  deleteCustomerOnline: async (req, res) => {
    const { Id } = req.params;

    try {
     
      const updatedOrder = await onlineOrders.findOneAndUpdate(
        { "customerOnlineOrder.Id": Id },
        { $pull: { customerOnlineOrder: { Id: Id } } },
        { new: true } 
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "OrderNotefound" });
      }

      return res
        .status(200)
        .json({ message: "CustomerOnline Order delete successfuly" });
    } catch (error) {
      console.log(error);
    }
  },

  // Edit CustomerOnlineItems Edit

  CustomerOnlineItemsEdit: async (req, res) => {
    const { Id } = req.params;

    try {
      const { totalAmount, Items } = req.body;

      const updateCustomerOrder = await onlineOrders.findOne({
        "customerOnlineOrder.Id": Id, // Search for the Id inside the array
      });

      if (!updateCustomerOrder) {
        return res.status(404).json({
          message: "Customer Online Orders not found",
        });
      }

      // Find the specific order inside the customerOnlineOrder array
      const orderToUpdate = updateCustomerOrder.customerOnlineOrder.find(
        (order) => order.Id === parseInt(Id)
      );

      if (!orderToUpdate) {
        return res.status(404).json({
          message: "Order with the specified Id not found",
        });
      }

      orderToUpdate.Items = Items || updateCustomerOrder.Items;
      orderToUpdate.totalAmount = totalAmount || updateCustomerOrder.totalAmount;

      // Save the updated order
      await updateCustomerOrder.save();

     
      // Send a success response
      res.status(200).json({
        message: "Online CustomerOrder updated successfully",
        updateCustomerOrder,
      });
    } catch (error) {
      console.log(error);
    }
  },




  //Tax created

  createTax: async (req, res) => {
    try {
      const { Taxname, Percentage, TaxType } = req.body;
      // Create a new tax Iten using the TaxItem model

      // Ensure the Percentage has the "%" symbol
      let percentageValue = String(Percentage).trim();
      if (!percentageValue.endsWith("%")) {
        percentageValue += "%"; // Append "%" if it's not included
      }

      const TaxcreateDate = moment().tz("Asia/Kolkata").format();

      const newTaxItem = new TaxItem({
        Taxname,
        Percentage: percentageValue, // Save the percentage with "%"
        TaxType,
        TaxcreateDate,
      });

      // save the new Item to the database

      await newTaxItem.save();
      // Send success response
      return res
        .status(201)
        .json({ message: "Tax item created successfully", tax: newTaxItem });
    } catch (error) {
      // Handle any errors
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // getAllTaxes

  getTax: async (req, res) => {
    try {
      const TaxessAll = await TaxItem.find();
      return res.status(200).json(TaxessAll);
    } catch (error) {
      console.error("Error retrieving orders:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Edit AllTaxes

  EditTaxes: async (req, res) => {
    const { TaxeID } = req.params;
    console.log(TaxeID, "TaxeID");

    try {
      const { Taxname, Percentage, TaxType } = req.body;
      console.log(req.body, "req.body");

      // Find the waiter order by its ID and wait for the result
      const taxes = await TaxItem.findById(TaxeID);
      console.log(taxes, "taxes");
      if (!taxes) {
        return res.status(404).json({
          message: "Taxes not found",
        });
      }

      taxes.Taxname = Taxname || taxes.Taxname;
      taxes.Percentage = Percentage || taxes.Percentage;
      taxes.TaxType = TaxType || taxes.TaxType;

      // Save the updated order
      await taxes.save();

      // Send a success response
      res.status(200).json({
        message: "Taxes updated successfully",
        taxes,
      });
    } catch (error) {
      console.log(error);
    }
  },

  // DeleteAllTaxes

  DeleteTax: async (req, res) => {
    const { TaxeID } = req.params;
    console.log(TaxeID, "TaxeID");
    try {
      const TaxDelete = await TaxItem.findByIdAndDelete(TaxeID);
      if (!TaxDelete) {
        return res.status(404).json({ message: "Tax Note found" });
      }
      return res.status(200).json({ message: "Tax Deleted Successfuly" });
    } catch (error) {
      res.status(500).send("Error Deleted Tax.");
    }
  },
};

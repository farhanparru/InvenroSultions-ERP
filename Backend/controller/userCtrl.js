const POSorder = require("../Model/userModel");
const OnlineOrder = require("../Model/onlineOrdermodel");
const Category = require("../Model/Categorymodel");
const EmployeSchema = require("../Model/Employemodel");
const Customer = require("../Model/Customermodel");
const Floor = require("../Model/Floormodel");
const Table = require("../Model/Hometablemodel");
const Waiter = require("../Model/Waiterodermodel");
const AddToSheetItem = require("../Model/catlogItemModel");
const ItemDevices = require("../Model/Devicesmodel");
const POSItems = require("../Model/PosItemsmodel");
const WebSocket = require("ws");                   
const bcrypt = require("bcrypt");
const axios = require("axios");
const moment = require("moment-timezone");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const ExcelSheetData = require("../Model/ItemsModal");
const XLSX = require("xlsx");
const mongoose = require("mongoose");
require("dotenv").config();

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

  // Webhook endpoint to handle incoming orders
  onlineOrder: async (req, res) => {
    try {
      const {
        order_id,
        catalog_id,
        payment_method,
        cart_total,
        customer_name,
        customer_phone_number,
        payment_status,
        item_lines, // Extract item_lines from the request body
      } = req.body;

      // Map item_lines to orderDetails structure
      const orderDetails = item_lines.map((item) => ({
        product_name: item.product_name,
        product_quantity: item.product_quantity,
        product_currency: item.product_currency,
        unit_price: item.unit_price,
      }));

      // Convert current date and time to IST
      const orderDate = moment().tz("Asia/Kolkata").format();
      // Construct order data
      const orderData = {
        orderDetails: orderDetails, // Store all products
        orderMeta: {
          posOrderId: order_id,
          orderType: catalog_id,
          paymentMethod: payment_method,
          paymentTendered: cart_total,
          orderDate: orderDate, // Save in IST
          paymentStatus: payment_status,
        },

        customer: {
          name: customer_name,
          phone: customer_phone_number,
        },
      };

      // console.log(orderData);
      // Save order to database
      const order = new OnlineOrder(orderData);
      await order.save();

      // Broadcast the new order to all WebSocket clients
      const wss = req.app.get("wss"); // Ensure WebSocket server is available
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(orderData));
        }
      });

      res.status(200).send("Order received");
    } catch (error) {
      console.error("Error processing order:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // Online Customer

  onlineCustomer: async (req, res) => {
    try {
      const { customerName, phoneNumber, Location } = req.body;

      // Save the customer data to the database
      const newCustomer = new customerOnline({
        customerDetails: {
          customerName,
          phoneNumber,
          Location,
        },
      });

      const savedCustomer = await newCustomer.save();

      console.log(savedCustomer, "savedCustomer");

      // (Optional) Send acknowledgment back to XpressBot if needed
      // await axios.post('XpressBot API URL', { ...response });

      // Broadcast the new order to all WebSocket clients
      const wss = req.app.get("wss");
      if (wss) {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(savedCustomer));
          }
        });
      }

      res.status(200).json({
        message: "Customer data processed successfully",
        savedCustomer,
      });
    } catch (error) {
      console.error("Error processing customer data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Fetch Orders Endpoint

  fetchOnlineOrder: async (req, res) => {
    try {
      const orders = await OnlineOrder.find();
      res.json(orders);
      console.log(orders);
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

  // payment status
  statusUpdate: async (req, res) => {
    const { status } = req.body;

    try {
      const order = await OnlineOrder.findByIdAndUpdate(
        req.params.id,
        { paymentStatus: status },
        { new: true } // Return the updated order
      );

      if (!order) {
        return res.status(404).send("Order not found");
      }

      res.send(order); // Send back the updated order
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  },

  // paymentStatus update

  paymentStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      // Validate the status if necessary
      const validStatuses = [
        "Pending",
        "Accepted",
        "Ready",
        "Assigned",
        "Completed",
        "Rejected",
        "Cancelled",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      // Update the payment status in the database
      const updatedOrder = await OnlineOrder.findByIdAndUpdate(
        id,
        { "orderMeta.paymentStatus": status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(updatedOrder);
      console.log(updatedOrder, "updatedOrder");
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Internal Server Error" });
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

      // Save data to database
      for (const item of data) {
        await excelSheetDatas.create(item);
      }

      res.status(200).send("File processed and data saved.");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing file.");
    }
  },

  // getExcelSheet datas

  SheetDataGet: async (req, res) => {
    try {
      const items = await ExcelSheetData.find();
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

  // Google Sheet Webhook URL

  addSheetItem: async (req, res) => {
    // Google Sheet Webhook URL
    const googleSheetWebhookURL =
      "https://script.google.com/macros/s/AKfycbxQSe8f6i3ifmgC7oepM72UQC90gLkehtnjrvYFFzbHAzw_MPk-5dwFBuhqsh69JfjOGg/exec?gid=0";

    // Multer configuration for image uploads
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/"); // Set your destination folder
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to file name to avoid duplicates
      },
    });

    const upload = multer({ storage }).single("imageFile"); // Assuming the image is uploaded with 'imageFile' key

    try {
      // Upload the image via multer
      upload(req, res, async function (err) {
        if (err) {
          return res.status(400).json({ error: "Image upload failed", err });
        }

        const imageFile = req.file;
        let imageLink = "";

        // Extract fields from the request body after multer processes the request
        const {
          id,
          title,
          description,
          availability,
          condition,
          price,
          link,
          brand,
        } = req.body;

        // Log the request body and uploaded file
        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file);

        // Validate required fields
        if (!title || !description || !availability || !condition || !price) {
          return res.status(400).json({
            error:
              "All required fields (title, description, availability, condition, price) must be provided.",
          });
        }

        // Generate unique id if not provided
        const uniqueId = id || new mongoose.Types.ObjectId().toString();

        // Step 1: Upload image to Cloudinary if it exists
        if (imageFile) {
          const result = await cloudinary.uploader.upload(imageFile.path);
          imageLink = result.secure_url; // Secure URL returned from Cloudinary
        }

        // Step 2: Save the data to MongoDB
        const newItem = new AddToSheetItem({
          id: uniqueId,
          title,
          description,
          availability,
          condition,
          price,
          link,
          brand,
          image_link: imageLink,
        });

        await newItem.save();

        // Step 3: Send data to Google Sheets using the webhook URL
        await axios.post(googleSheetWebhookURL, {
          id: uniqueId,
          title,
          description,
          availability,
          condition,
          price,
          link,
          brand,
          image_link: imageLink, // The image link from Cloudinary
        });

        // Respond with success
        res.status(201).json({
          message: "Item successfully added to the database and Google Sheet!",
          id: uniqueId,
          image_link: imageLink,
        });
      });
    } catch (error) {
      console.error("Error adding item: ", error);
      res.status(500).json({
        error: "Failed to add item to the database or Google Sheet.",
      });
    }
  },

  // POSItemscreate

  POSItem: async (req, res) => {
    try {
      const { title, price, Itemcode, category, Device } = req.body;

      // Validate required fields
      if (!title || !price || !Itemcode || !category) {
        return res.status(400).json({ msg: "All fields are required" });
      }

      // Check if the item with the same code already exists
      const existingItem = await POSItems.findOne({ Itemcode });              
      if (existingItem) {
        return res
          .status(400)
          .json({ msg: "Item with this code already exists" });
      }

      // Create a new POS Item
      const newItem = new POSItems({
        title,
        price,
        Itemcode,
        category,
        Device,
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

  getPosItems:async(req,res)=>{
  try {
    const POSItemsALL = await POSItems.find();
    res.status(200).json(POSItemsALL);
  } catch (error) {
    console.log('error all retrive Items');
    
  }
  },



  // create a ItemDevices

  ItemDevices: async (req, res) => {
    try {
      const { Name, Location, Devices } = req.body;

      // Validate that all required fields are present
      if (!Name || !Location || !Devices) {
        return res.status(400).json({ msg: "All fields are required" });
      }
      const DevicesCreateDate = moment().tz("Asia/Kolkata").format();


      // Create a new ItemDevices document
      const KdsDevices = new ItemDevices({
        Name,
        Location,
        Devices,
        DevicesCreateDate
      });

      // Save the document to the database
      await KdsDevices.save();

      // Return success response
      return res.status(201).json({
        msg: "Device successfully added",
        KdsDevices,
      });

    } catch (error) {
      // Log the error and return a 500 response with the error message
      console.error("Error saving the device:", error);
      return res.status(500).json({
        msg: "Server error, please try again later",
        error: error.message,
      });
    }
  },

  // get ItemDevices All

  getDevices:async(req,res)=>{
    try {
      const AllDevices = await ItemDevices.find();
      res.status(200).json(AllDevices);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving itemsDevices.");
    }
  },




  // POST request to add a new waiter entry

  addWaiterOrder: async (req, res) => {
    try {
      // Destructure data from the request body
      const {
        billnumber,
        OdercreateDate,
        tableIds, // These should now be ObjectIds
        items,
        subTotal,
        tax,
        total,
        orderStatus,
        customerName,
        priceCategory,
      } = req.body;

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
};

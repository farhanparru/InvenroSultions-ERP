import {
  UilEstate,
  UilShoppingBag,
  UilServer,
  UilUser,
  UilPauseCircle,
  UilPercentage,
} from "@iconscout/react-unicons";
import React from "react";
import CustomerList from "../../customers/sections/CustomerList";

const HomeItemsSection = React.lazy(() =>
  import("../sections/body/components/HomeItemsSection")
);
const Customers = React.lazy(() => import("../../customers/Customers"));
const HomeTableSection = React.lazy(() =>
  import("../sections/body/components/HomeTableSection")
);

const HomeOrdersSection = React.lazy(() =>
  import("../sections/body/components/HomeOrdersSection")
);

const HomeDiscountSection = React.lazy(() =>
  import("../sections/body/components/HomeDiscountSection")
);

const HomeHoldCartSection = React.lazy(() =>
  import("../sections/body/components/HomeHoldCartSection")
);

const Home = React.lazy(() =>
  import("../Home")
);




export const TABLESTATES = {
  FREE: "free",
  BUSY: "busy",
  READYTOBILL: "ready-to-bill",
};

export const ORDERSTATES = {
  PENDING: "pending",
  READY: "ready",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const PAYMENTSTATUS = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "cancelled",
};

export const FLOORS = {
  BASEMENT: "basement",
  FIRST: "first",
  SECOND: "second",
};

export const categoriesList = [
  {
    title: "All",
    slug: "all",
  },
  {
    title: "BreakFast",
    slug: "breakfast",
  },
  {
    title: "Noon",
    slug: "noon",
  },
  {
    title: "Evening",
    slug: "evening",
  },
  {
    title: "Night",
    slug: "night",
  },
];

export const homeTopBarTabs = [
  {
    title: "Home",
    slug: "home",
    is_customer_needed: true,
    is_table_needed: false,
    section: Home,
    link:'/'
    
  },
  {
    title: "On Hold",
    slug: "on-hold",
    is_customer_needed: true,
    is_table_needed: false,
    section: CustomerList,
    link:'/on-hold'

  },
  // {
  //   title: "History",
  //   slug: "history",
  //   is_customer_needed: false,
  //   is_table_needed: false,
  //   section: Home,
  //   link:'/history'
  // },
  // {
  //   title: "Swiggy",
  //   slug: "swiggy",
  //   is_customer_needed: false,
  //   is_table_needed: false,
  // },
  // {
  //   title: "Zomato",
  //   slug: "zomato",
  //   is_customer_needed: false,
  //   is_table_needed: false,
  // },
  // {
  //   title: "Other",
  //   slug: "other",
  //   is_customer_needed: false,
  //   is_table_needed: false,
  // },

  // {
  //   title: "Take Away",
  //   slug: "take-away",
  //   is_customer_needed: false,
  //   is_table_needed: false,
  // },
  // {
  //   title: "Delivery",
  //   slug: "delivery",
  //   is_customer_needed: true,
  //   is_table_needed: false,
  // },
];

export const homePriceCategories = [
  {
    slug: "take-away",
    // section: HomeItemsSection,
    name:"Takeaway"
  },
  {
    slug: "dine-in",
    // section: HomeOrdersSection,
    name:"Dine In"

  },
  {
    slug: "delivery",
    // section: HomeOrdersSection,
    name:"Delivery"

  },
  
];

export const homeBodySection = [
  {
    slug: "home",
    icon: UilEstate,
    section: HomeItemsSection,
    name: "Home"
  },
  {
    slug: "orders",
    icon: UilShoppingBag,
    section: HomeOrdersSection,
    name: "History"
  },

  {
    slug: "online-orders",
    icon: UilServer,
    section: HomeOrdersSection,
    name: "Online Orders"

  },
  {
    slug: "scheduled-orders",
    icon: UilServer,
    section: HomeOrdersSection,
    name: "Scheduled Orders"

  },
  {
    slug: "tables",
    icon: UilServer,
    section: HomeTableSection,
    name: "Tables"

  },
 
  {
    slug: "hold-carts",
    icon: UilPauseCircle,
    section: HomeHoldCartSection,
    name:"On Hold"
  },
];



export const tablesList = [
  {
    id: 1,
    name: "T1",
    status: TABLESTATES.FREE,
    floor: FLOORS.BASEMENT,
  },
  {
    id: 2,
    name: "T2",
    status: TABLESTATES.FREE,
    floor: FLOORS.BASEMENT,
  },
  {
    id: 3,
    name: "T3",
    status: TABLESTATES.FREE,
    floor: FLOORS.BASEMENT,
  },
  {
    id: 4,
    name: "T4",
    status: TABLESTATES.FREE,
    floor: FLOORS.BASEMENT,
  },
  {
    id: 5,
    name: "T5",
    status: TABLESTATES.FREE,
    floor: FLOORS.BASEMENT,
  },
  {
    id: 6,
    name: "T6",
    status: TABLESTATES.FREE,
    floor: FLOORS.BASEMENT,
  },
  {
    id: 7,
    name: "T7",
    status: TABLESTATES.FREE,
    floor: FLOORS.BASEMENT,
  },
  {
    id: 8,
    name: "T8",
    status: TABLESTATES.FREE,
    floor: FLOORS.BASEMENT,
  },
  {
    id: 9,
    name: "T9",
    status: TABLESTATES.FREE,
    floor: FLOORS.BASEMENT,
  },
  {
    id: 10,
    name: "T10",
    status: TABLESTATES.FREE,
    floor: FLOORS.FIRST,
  },
  {
    id: 11,
    name: "T11",
    status: TABLESTATES.FREE,
    floor: FLOORS.FIRST,
  },
  {
    id: 12,
    name: "T12",
    status: TABLESTATES.FREE,
    floor: FLOORS.FIRST,
  },
  {
    id: 13,
    name: "T13",
    status: TABLESTATES.FREE,
    floor: FLOORS.FIRST,
  },
  {
    id: 14,
    name: "T14",
    status: TABLESTATES.FREE,
    floor: FLOORS.FIRST,
  },
  {
    id: 15,
    name: "T15",
    status: TABLESTATES.FREE,
    floor: FLOORS.FIRST,
  },
  {
    id: 16,
    name: "T16",
    status: TABLESTATES.FREE,
    floor: FLOORS.FIRST,
  },
  {
    id: 17,
    name: "T17",
    status: TABLESTATES.FREE,
    floor: FLOORS.FIRST,
  },
  {
    id: 18,
    name: "T18",
    status: TABLESTATES.FREE,
    floor: FLOORS.FIRST,
  },
  {
    id: 19,
    name: "T19",
    status: TABLESTATES.FREE,
    floor: FLOORS.SECOND,
  },
  {
    id: 20,
    name: "T20",
    status: TABLESTATES.FREE,
    floor: FLOORS.SECOND,
  },
  {
    id: 21,
    name: "T21",
    status: TABLESTATES.FREE,
    floor: FLOORS.SECOND,
  },
  {
    id: 22,
    name: "T22",
    status: TABLESTATES.FREE,
    floor: FLOORS.SECOND,
  },
];

export const homeItemsList = [
  {
    id: 1,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Eggwhite Frozen",
    size: 295,
    price: 7.09,
    category: "breakfast",
  },
  {
    id: 2,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Wine - Montecillo Rioja Crianza",
    size: 171,
    price: 4.18,
    category: "night",
  },
  {
    id: 3,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Halibut - Steaks",
    size: 513,
    price: 3.43,
    category: "evening",
  },
  {
    id: 4,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Orange - Blood",
    size: 279,
    price: 8.6,
    category: "breakfast",
  },
  {
    id: 5,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Crush - Orange, 355ml",
    size: 419,
    price: 9.16,
    category: "evening",
  },
  {
    id: 6,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Steampan Lid",
    size: 739,
    price: 5.66,
    category: "night",
  },
  {
    id: 7,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Bread - French Baquette",
    size: 984,
    price: 2.34,
    category: "night",
  },
  {
    id: 8,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Cookies - Assorted",
    size: 679,
    price: 0.01,
    category: "breakfast",
  },
  {
    id: 9,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Baking Powder",
    size: 591,
    price: 1.86,
    category: "night",
  },
  {
    id: 10,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Wine - White, French Cross",
    size: 753,
    price: 9.13,
    category: "night",
  },
  {
    id: 11,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Syrup - Chocolate",
    size: 826,
    price: 2.15,
    category: "night",
  },
  {
    id: 12,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Currants",
    size: 205,
    price: 1.53,
    category: "evening",
  },
  {
    id: 13,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Salmon Steak - Cohoe 8 Oz",
    size: 947,
    price: 1.11,
    category: "night",
  },
  {
    id: 14,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Water - Green Tea Refresher",
    size: 614,
    price: 6.16,
    category: "night",
  },
  {
    id: 15,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Baking Powder",
    size: 430,
    price: 7.41,
    category: "night",
  },
  {
    id: 16,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Chips - Potato Jalapeno",
    size: 717,
    price: 2.82,
    category: "evening",
  },
  {
    id: 17,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Lettuce - Iceberg",
    size: 996,
    price: 4.24,
    category: "evening",
  },
  {
    id: 18,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Parsley - Dried",
    size: 901,
    price: 3.14,
    category: "night",
  },
  {
    id: 19,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Wine - Casillero Deldiablo",
    size: 264,
    price: 1.58,
    category: "night",
  },
  {
    id: 20,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Veal - Provimi Inside",
    size: 1000,
    price: 2.34,
    category: "night",
  },
  {
    id: 21,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Triple Sec - Mcguinness",
    size: 188,
    price: 9.93,
    category: "evening",
  },
  {
    id: 22,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Parsley - Dried",
    size: 195,
    price: 4.95,
    category: "night",
  },
  {
    id: 23,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Beer - True North Strong Ale",
    size: 431,
    price: 10.0,
    category: "night",
  },
  {
    id: 24,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Rum - Spiced, Captain Morgan",
    size: 629,
    price: 5.87,
    category: "night",
  },
  {
    id: 25,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Beer - Blue Light",
    size: 204,
    price: 9.85,
    category: "night",
  },
  {
    id: 26,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Muffin - Carrot Individual Wrap",
    size: 494,
    price: 0.44,
    category: "evening",
  },
  {
    id: 27,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Clams - Canned",
    size: 411,
    price: 9.34,
    category: "evening",
  },
  {
    id: 28,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Lotus Root",
    size: 125,
    price: 1.86,
    category: "night",
  },
  {
    id: 29,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Bacardi Limon",
    size: 641,
    price: 7.01,
    category: "night",
  },
  {
    id: 30,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Bread - Pumpernickle, Rounds",
    size: 533,
    price: 6.58,
    category: "night",
  },
  {
    id: 31,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName:
      "Pork - Loin, Boneless Pork - Loin, Boneless Pork - Loin, Boneless Pork - Loin, Boneless",
    size: 700,
    price: 4.23,
    category: "night",
  },
  {
    id: 32,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Smirnoff Green Apple Twist",
    size: 440,
    price: 8.69,
    category: "night",
  },
  {
    id: 33,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Salmon - Fillets",
    size: 586,
    price: 9.95,
    category: "noon",
  },
  {
    id: 34,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Jicama",
    size: 600,
    price: 4.04,
    category: "night",
  },
  {
    id: 35,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Island Oasis - Mango Daiquiri",
    size: 740,
    price: 3.98,
    category: "evening",
  },
  {
    id: 36,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Oil - Grapeseed Oil",
    size: 460,
    price: 2.92,
    category: "noon",
  },
  {
    id: 37,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Vector Energy Bar",
    size: 279,
    price: 8.86,
    category: "night",
  },
  {
    id: 38,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Trout - Smoked",
    size: 575,
    price: 9.41,
    category: "evening",
  },
  {
    id: 39,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Cranberry Foccacia",
    size: 968,
    price: 6.18,
    category: "night",
  },
  {
    id: 40,
    image: "https://loremflickr.com/320/240/food,recipe,breakfast,lunch",
    itemName: "Flower - Dish Garden",
    size: 641,
    price: 2.0,
    category: "night",
  },
];

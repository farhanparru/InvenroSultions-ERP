import React from 'react';
import { useSelector } from "react-redux";
import { getStoreUserData } from "../../../../app/store/storeUser/storeUserSlice.js";
import { getSelectedTab } from "../store/homeSlice.js";
import { getSelectedCustomer } from "../store/customerSlice.js";
import logo from '../../../../assets/1.png'

const Print = () => {
  const date = new Date();
  let finalItems = [];
  
  const store_user = useSelector(getStoreUserData);
  const selectedTab = useSelector(getSelectedTab);
  const odCount = useSelector((state) => state.odCount);
  const selectedCustomer = useSelector(getSelectedCustomer);
  const cartState = useSelector((state) => state.cart);

  let paymentMethod;

  switch (cartState.paymentMethod) {
    case "Cash":
      paymentMethod = "cash";
      break;

    case "Card":
      paymentMethod = "card";
      break;

    default:
      paymentMethod = "cash";
      break;
  }

 
  const data = [
    // Your data array should be populated here based on the state and logic
    {
      type: "image",
      url: "https://tyempos.shiftdevs.com/assets/logo-3dd3c3d0.png",
      position: "center",
      width: "50px",
      height: "50px",
    },
    {
      type: "text",
      value: store_user?.business?.name ?? "TyemPOS",
      style: {
        fontWeight: "700",
        textAlign: "center",
        fontSize: "15px",
        marginTop: "10px",
      },
    },
    {
      type: "text",
      value:
        '<p style="display: flex;justify-content: center; margin-bottom: 0px">LA GARDEN, near, Railway Station Road, Theruvath, Kasaragod, Kerala 671121</p>',
      style: { fontSize: "12px", textAlign: "center", color: "black" },
    },
    {
      type: "text",
      value: "<hr>",
      style: { fontWeight: "700", textAlign: "center", fontSize: "5px" },
    },
    {
      type: "text",
      value: "Order Type : " + selectedTab?.name,
      style: { textAlign: "center", fontSize: "10px", fontWeight: "900" },
    },
    {
      type: "text",
      value: "<hr>",
      style: { fontWeight: "700", textAlign: "center", fontSize: "5px" },
    },
  {
    type: "table",
    // style the table
    style: { fontSize: "12px" },
    tableBodyStyle: { borderTop: "white", fontWeight: "900" },
    // list of the columns to be rendered in the table header
    // tableHeader: ['Item', 'Price','Qty', 'Total'],
    // multi dimensional array depicting the rows and columns of the table body
    tableBody: [
      [
        '<span style="width: 100%; text-align: left; display: flex">Order No : </span>',
        '<span style="width: 100%; text-align: left; display: flex; font-weight: bold; font-size: 20px">' +
          (odCount + 1) +
          "</span>",
      ],
      [
        '<span style="width: 100%; text-align: left; display: flex">Invoice No :</span>',
        '<span style="width: 100%; text-align: left; display: flex">' +
          date.getDate() +
          (date.getMonth() + 1) +
          date.getFullYear() +
          (odCount + 1) +
          "</span>",
      ],

      [
        '<span style="width: 100%; text-align: left; display: flex">Employee	:</span>',
        '<span style="width: 100%; text-align: left; display: flex">SHAHABIYA CASHIER</span>',
      ],
      selectedCustomer != undefined
        ? [
            '<span style="width: 100%; text-align: left; display: flex">Customer Name :</span>',
            '<span style="width: 100%; text-align: left; display: flex">' +
              selectedCustomer?.name +
              "</span>",
          ]
        : [],
      selectedCustomer && selectedCustomer?.shipping_address !== null
        ? [
            '<span style="width: 100%; text-align: left; display: flex">Customer Phone :</span>',
            '<span style="width: 100%; text-align: left; display: flex">' +
              selectedCustomer.mobile +
              "</span>",
          ]
        : [],
      selectedCustomer && selectedCustomer?.shipping_address !== null
        ? [
            '<span style="width: 100%; text-align: left; display: flex">Customer Address :</span>',
            '<span style="width: 100%; text-align: left; display: flex">' +
              selectedCustomer.shipping_address +
              "</span>",
          ]
        : [],
      [
        '<span style="width: 100%; text-align: left; display: flex">Date & Time :</span>',
        '<span style="width: 100%; text-align: left; display: flex">' +
          date.getDate() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getFullYear() +
          " - " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          "</span>",
      ],
    ],

    // list of columns to be rendered in the table footer
    // custom style for the table header
    tableHeaderStyle: { backgroundColor: "white", color: "black" },
    // custom style for the table body
    // custom style for the table footer
    tableFooterStyle: { backgroundColor: "white", color: "black" },
  },

  {
    type: "table",
      // style the table
      style: {
        marginTop: "10px",
      },
      // list of the columns to be rendered in the table header
      tableHeader: ["Item Name", "Price", "Qty", "Amount"],
      // multi dimensional array depicting the rows and columns of the table body
      tableBody: finalItems,
      // list of columns to be rendered in the table footer
      // custom style for the table header
      tableHeaderStyle: {
        backgroundColor: "white",
        color: "black",
        borderTop: "1px solid #ddd",
        borderBottom: "1px solid #ddd",
      },
      // custom style for the table body
      tableBodyStyle: { textAlign: "center", fontWeight: "900" },
      // custom style for the table footer
      tableFooterStyle: { backgroundColor: "white", color: "black" },
  },
  {
    type: "table",
      // style the table
      style: { marginTop: "15px" },
      tableBodyStyle: { textAlign: "left", fontWeight: "900" },
      // list of the columns to be rendered in the table header
      // tableHeader: ['Item', 'Price','Qty', 'Total'],
      // multi dimensional array depicting the rows and columns of the table body
      tableBody: [
        [
          '<span style="width: 100%; text-align: left; display: flex">  </span>',
          '<span style="width: 100%; text-align: right; display: flex;    justify-content: flex-end;"> ' +
            "Total Taxable Amount : " +
            parseFloat(cartState.totalAmount).toFixed(3) +
            "</span>",
        ],
        [
          '<span style="width: 100%; text-align: left; display: flex"> </span>',
          '<span style="width: 100%; text-align: right; display: flex;    justify-content: flex-end;"> ' +
            "VAT Total:" +
            parseFloat(cartState.tax).toFixed(3) +
            "</span>",
        ],
        parseFloat(cartState.discount) > 0
          ? [
              '<span style="width: 100%; text-align: left; display: flex">Total Discount  </span>',
              '<span style="width: 100%; text-align: right; display: flex;    justify-content: flex-end;"> ' +
                parseFloat(cartState.discount).toFixed(3) +
                "</span>",
            ]
          : [],
        [
          '<span style="width: 100%; text-align: left; display: flex; font-weight: bold; font-size: 15px">  </span>',
          '<span style="width: 100%; text-align: right; display: flex;font-weight: bold; font-size: 15px;    justify-content: flex-end;">' +
            "Total:" +
            parseFloat(cartState.totalPayableAmount).toFixed(3) +
            "</span>",
        ],
      ],
      // list of columns to be rendered in the table footer
      // custom style for the table header
      tableHeaderStyle: { backgroundColor: "white", color: "black" },
      // custom style for the table body
      // custom style for the table footer
      tableFooterStyle: { backgroundColor: "white", color: "black" },
  },
  {
    
    type: "table",
    // style the table
    style: { marginTop: "0px" },
    tableBodyStyle: { textAlign: "left", fontWeight: "900" },
    // list of the columns to be rendered in the table header
    // tableHeader: ['Item', 'Price','Qty', 'Total'],
    // multi dimensional array depicting the rows and columns of the table body
    tableBody: [
      [
        '<span style="width: 100%; text-align: left; display: flex">' +
          "" +
          "	 </span>",
        '<span style="width: 100%; text-align: right; display: flex;    justify-content: flex-end;"> ' +
          "Total Items: " +
          finalItems?.length +
          "</span>",
      ],
      [
        '<span style="width: 100%; text-align: left; display: flex">' +
          "	</span>",
        '<span style="width: 100%; text-align: right; display: flex;    justify-content: flex-end;"> ' +
          paymentMethod +
          ": ₹ " +
          parseFloat(cartState.totalPayableAmount).toFixed(3) +
          "</span>",
      ],
      // [
      //   '<span style="width: 100%; text-align: left; display: flex">Tendered Amount :</span>',
      //   '<span style="width: 100%; text-align: right; display: flex;    justify-content: flex-end;">' +
      //   parseFloat(cartState.totalPayableAmount).toFixed(3) +
      //   "</span>",
      // ],
      // [
      //   '<span style="width: 100%; text-align: left; display: flex; ">Amount to be returned		:</span>',
      //   '<span style="width: 100%; text-align: right; display: flex;    justify-content: flex-end;">₹ 0.00</span>',
      // ],
    ],
    // list of columns to be rendered in the table footer
    // custom style for the table header
    tableHeaderStyle: { backgroundColor: "white", color: "black" },
    // custom style for the table body
    // custom style for the table footer
    tableFooterStyle: { backgroundColor: "white", color: "black" },
  },
  {
    type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    value: "<hr>",
    style: {
      fontWeight: "700",
      textAlign: "center",
      fontSize: "24px",
      marginBottom: "10px",
    },
  },
  {
    type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
    value:
      '<p style="display: flex;justify-content: center; margin-bottom: 0px">Thank You, Visit Again</p>',
    style: { fontSize: "12px", textAlign: "center", color: "black" },
  },
  {
    type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value:
        '<p style="display: flex;justify-content: center; margin-bottom: 0px">Technology Partners https://tyemventures.in/</p>',
      style: { fontSize: "12px", textAlign: "center", color: "black" },
  }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <style type="text/css">
        {`
          div, aside, button {
            display: block;
            margin: 1rem auto;
            text-align: center;
          }
          @media print {
            /* Hide elements not in the print area */
            body > *:not(.print-area):not(script) {
              visibility: hidden;
            }
            /* Ensure the print area is visible */
            .print-area, .print-area * {
              visibility: visible;
            }
            /* Adjust the print area to occupy the full page */
            .print-area {
              position: absolute;
              top: 0;
              left: 0;
              width: 3.1in;
              height: auto;
            }
          }
        `}
      </style>
      <div className="print-area" style={{ width: '5.1in' }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <img 
            src={logo}
            alt="Logo" 
            style={{ width: '50px', height: '50px', display: 'block', margin: '0 auto' }}
          />
          <h2 style={{ margin: '5px 0' }}>TyemPOS</h2>
          <p style={{ fontSize: '12px', color: 'black', margin: '0' }}>
            LA GARDEN, near, Railway Station Road, Theruvath, Kasaragod, Kerala 671121
          </p>
        </div>
        <hr style={{ width: '80%', margin: '10px auto' }} />
        <p style={{ textAlign: 'center', fontSize: '10px', fontWeight: '900', margin: '5px 0' }}>
          Order Type: {selectedTab?.name}
        </p>
        <hr style={{ width: '80%', margin: '10px auto' }} />

        <table style={{ width: '80%', margin: '0 auto', textAlign: 'left' }}>
          <tbody>
            <tr>
              <td>Order No:</td>
              <td style={{ textAlign: 'right' }}>{odCount + 1}</td>
            </tr>
            <tr>
              <td>Invoice No:</td>
              <td style={{ textAlign: 'right' }}>
                {date.getDate()}{(date.getMonth() + 1)}{date.getFullYear()}{(odCount + 1)}
              </td>
            </tr>
            <tr>
              <td>Employee:</td>
              <td style={{ textAlign: 'right' }}>SHAHABIYA CASHIER</td>
            </tr>
            {selectedCustomer && (
              <>
                <tr>
                  <td>Customer Name:</td>
                  <td style={{ textAlign: 'right' }}>{selectedCustomer.name}</td>
                </tr>
                <tr>
                  <td>Customer Phone:</td>
                  <td style={{ textAlign: 'right' }}>{selectedCustomer.mobile}</td>
                </tr>
                <tr>
                  <td>Customer Address:</td>
                  <td style={{ textAlign: 'right' }}>{selectedCustomer.shipping_address}</td>
                </tr>
              </>
            )}
            <tr>
              <td>Date & Time:</td>
              <td style={{ textAlign: 'right' }}>
                {date.getDate()}/{(date.getMonth() + 1)}/{date.getFullYear()} - {date.getHours()}:{date.getMinutes()}
              </td>
            </tr>
          </tbody>
        </table>

        <table style={{ width: '80%', margin: '0 auto', textAlign: 'left', marginTop: '10px' }}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {finalItems.map((item, index) => (
              <tr key={index}>
                <td>{item[0]}</td>
                <td style={{ textAlign: 'right' }}>{item[1]}</td>
                <td style={{ textAlign: 'right' }}>{item[2]}</td>
                <td style={{ textAlign: 'right' }}>{item[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table style={{ width: '80%', margin: '0 auto', textAlign: 'left', marginTop: '15px' }}>
          <tbody>
            <tr>
              <td>Total Taxable Amount:</td>
              <td style={{ textAlign: 'right' }}>{parseFloat(cartState.totalAmount).toFixed(3)}</td>
            </tr>
            <tr>
              <td>VAT Total:</td>
              <td style={{ textAlign: 'right' }}>{parseFloat(cartState.tax).toFixed(3)}</td>
            </tr>
            {parseFloat(cartState.discount) > 0 && (
              <tr>
                <td>Total Discount:</td>
                <td style={{ textAlign: 'right' }}>{parseFloat(cartState.discount).toFixed(3)}</td>
              </tr>
            )}
            <tr>
              <td style={{ fontWeight: 'bold', fontSize: '15px' }}>Total:</td>
              <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '15px' }}>
                {parseFloat(cartState.totalPayableAmount).toFixed(3)}
              </td>
            </tr>
          </tbody>
        </table>

        <table style={{ width: '80%', margin: '0 auto', textAlign: 'left', marginTop: '0px' }}>
          <tbody>
            <tr>
              <td>Total Items:</td>
              <td style={{ textAlign: 'right' }}>{finalItems?.length}</td>
            </tr>
            <tr>
              <td>{paymentMethod}:</td>
              <td style={{ textAlign: 'right' }}>₹ {parseFloat(cartState.totalPayableAmount).toFixed(3)}</td>
            </tr>
          </tbody>
        </table>

        <hr style={{ width: '80%', margin: '10px auto' }} />

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'black' }}>
          Thank You, Visit Again
        </p>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'black' }}>
          Technology Partners https://tyemventures.in/
        </p>
      </div>
      <button id="printBtn" onClick={handlePrint}>
        Print
      </button>
    </div>
  );
};

export default Print;
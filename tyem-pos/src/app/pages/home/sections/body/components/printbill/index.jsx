import React, { useEffect } from "react";


const printReceipt = () => {
  window.print();
};


const Bill = ({ selectedOrder }) => {
  return (
    <div>
      <div class="ticket">
        <h2 class="centered">
          ASMAK TAZA
          <br />
          {/* Address line 1
          <br />
          Address line 2{" "} */}
        </h2>
        <table>
          <thead>
            <tr>
              <th class="description">Item name</th>
              <th class="quantity">Q.</th>
              <th class="price">₹</th>
            </tr>
          </thead>
          <tbody>
            {selectedOrder?.orderitems.map((item, i) => {
              return [
                <tr>
                  <td class="quantity">{item.name}</td>
                  <td class="description">{item.quantity}</td>
                  <td class="price">{item.price}</td>
                </tr>,
              ];
            })}
          </tbody>
        </table>
        <p class="centered">
          Thanks for your purchase!
        
        </p>
      </div>

      <button class="hide-on-print" onClick={printReceipt}>
        Print
      </button>
    </div>
  );
};

export default Bill;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import io from 'socket.io-client';
import Header from './Headr';
import Sidebar from './Sidebar';

// const socket = io(''); // WebSocket server URL

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses', error);
    }
  };

  useEffect(() => {
    fetchExpenses();

    // Listen for new expenses via WebSocket
    socket.on('newExpense', (newExpense) => {
      setExpenses((prevExpenses) => [...prevExpenses, JSON.parse(newExpense)]);
    });

    return () => {
      socket.off('newExpense');
    };
  }, []);

  
  return (
    <div className="app">
    <Header className="header" OpenSidebar={OpenSidebar} />
      <div className="flex flex-grow">
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <main className="main-content">
          <h1>Expense List</h1>
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.Amount}</td>
                  <td>{expense.Description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default ExpenseList;

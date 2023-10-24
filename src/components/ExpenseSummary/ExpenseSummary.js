import React, { useEffect, useState } from 'react';
import { getTotalExpensesByCategory } from '../../utils/indexedDBUtils';
import './ExpenseSummary.css';

function ExpenseSummary() {
  const [categoryExpenses, setCategoryExpenses] = useState({});

  useEffect(() => {
    getTotalExpensesByCategory()
      .then((data) => {
        setCategoryExpenses(data);
      })
      .catch((error) => {
        console.error('Error fetching total expenses by category:', error);
      });
  }, []);

  return (
    <div>
      <h2>Expenses Summary</h2>
      <table className="expense-summary-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Total Expenses</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(categoryExpenses).map(([category, totalExpense]) => (
            <tr key={category}>
              <td>{category}</td>
              <td>{totalExpense}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseSummary;

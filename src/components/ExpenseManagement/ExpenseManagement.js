import React, { useState } from 'react';
import ExistingExpenses from './ExistingExpenses';
import AddExpense from './AddExpense';
import './ExpenseManagement.css';

function ExpenseManagement() {
  const [display, setDisplay] = useState('');

  const handleButtonClick = (value) => {
    setDisplay(value);
  };

  return (
    <div className="expense-management-container">
      {display === '' && (
        <div className="expense-management-buttons">
          <button onClick={() => handleButtonClick('existing')}>Existing Expenses</button>
          <button onClick={() => handleButtonClick('add')}>Add New Expense</button>
        </div>
      )}
      {display === 'existing' && <ExistingExpenses />}
      {display === 'add' && <AddExpense />}
    </div>
  );
}

export default ExpenseManagement;

import React, { useEffect, useState } from 'react';
import { getAllRows, addRow } from '../../utils/indexedDBUtils';
import { USER_TABLE, CATEGORY_TABLE, EXPENSE_TABLE } from '../../constants/indexedDBConstants';
import { v4 as uuidv4 } from 'uuid';

const AddExpense = () => {
  const [users, setUsers] = useState({});
  const [categories, setCategories] = useState({});
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    getAllRows(USER_TABLE).then((data) => setUsers(data));
    getAllRows(CATEGORY_TABLE).then((data) => setCategories(data));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = true;

    if (!selectedUser) {
      isValid = false;
      alert('Please select a user');
    } else if (!selectedCategory) {
      isValid = false;
      alert('Please select a category');
    } else if (!description) {
      isValid = false;
      alert('Please provide a description');
    } else if (!cost) {
      isValid = false;
      alert('Please provide a cost');
    }

    if (isValid) {
      const expenseId = uuidv4();
      addRow(
        {
          expense_id: expenseId,
          expense_description: description,
          expense_cost: cost,
          category_id: selectedCategory,
          user_id: selectedUser,
        },
        EXPENSE_TABLE
      );
      setSuccessMessage('Expense logged successfully');
      setTimeout(() => {
        setSuccessMessage('');
        setSelectedUser('');
        setSelectedCategory('');
        setDescription('');
        setCost('');
      }, 3000);
    }
  };

  return (
    <div className="add-expense-container">
      <h2>Add Expense</h2>
      {successMessage && <p>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          User:
          <select
            size="4"
            className="select-dropdown"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select User</option>
            {Object.entries(users).map((user) => (
              <option key={user[0]} value={user[0]}>
                {user[1].user_first_name} {user[1].user_last_name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Category:
          <select
            size="4"
            className="select-dropdown"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {Object.entries(categories).map((category) => (
              <option key={category[0]} value={category[0]}>
                {category[1].category_name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Description:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <br />
        <label>
          Cost:
          <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
        </label>
        <br />
        <button type="submit">Submit Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;

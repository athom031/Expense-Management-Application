import React, { useEffect, useState } from 'react';
import { getAllRows, deleteRow, updateRow } from '../../utils/indexedDBUtils';
import { EXPENSE_TABLE, USER_TABLE, CATEGORY_TABLE } from '../../constants/indexedDBConstants';

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState({});
  const [users, setUsers] = useState({});
  const [categories, setCategories] = useState({});
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [editExpense, setEditExpense] = useState(false);
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchExpenses();
    fetchUsers();
    fetchCategories();
  }, []);

  const fetchExpenses = () => {
    getAllRows(EXPENSE_TABLE).then((data) => setExpenses(data));
  };

  const fetchUsers = () => {
    getAllRows(USER_TABLE).then((data) => setUsers(data));
  };

  const fetchCategories = () => {
    getAllRows(CATEGORY_TABLE).then((data) => setCategories(data));
  };

  const handleExpenseClick = (expense) => {
    setSelectedExpense(expense);
    setDescription(expense.expense_description);
    setCost(expense.expense_cost);
    setSelectedUser(expense.user_id);
    setSelectedCategory(expense.category_id);
    setEditExpense(false);
    setMessage('');
    setIsSuccess(false);
  };

  const handleDeleteExpense = (expenseId) => {
    if (isConfirmDelete) {
      deleteRow(EXPENSE_TABLE, expenseId);
      fetchExpenses();
      setIsConfirmDelete(false);
      setSelectedExpense(null);
      setMessage('');
      setIsSuccess(false);
    } else {
      setIsConfirmDelete(true);
      setEditExpense(false);
      setMessage('');
      setIsSuccess(false);
    }
  };

  const handleUpdateExpense = () => {
    if (description && cost && selectedUser && selectedCategory) {
      const updatedExpense = { ...selectedExpense, expense_description: description, expense_cost: cost, user_id: selectedUser, category_id: selectedCategory };
      updateRow(EXPENSE_TABLE, updatedExpense);
      fetchExpenses();
      setSelectedExpense(updatedExpense);
      setEditExpense(false);
      setMessage('Expense updated successfully');
      setIsSuccess(true);
    } else {
      setMessage('Please provide all necessary fields');
      setIsSuccess(false);
    }
  };

  return (
    <div>
      <div>
        {Object.values(expenses).map((expense) => (
          <div key={expense.expense_id} onClick={() => handleExpenseClick(expense)}>
            <p>
              User: {users[expense.user_id] ? `${users[expense.user_id].user_first_name} ${users[expense.user_id].user_last_name}` : 'User not found'} | Category: {categories[expense.category_id] ? categories[expense.category_id].category_name : 'Category not found'} | Cost: ${expense.expense_cost} | Description: {expense.expense_description}
            </p>
          </div>
        ))}
      </div>
      {selectedExpense && (
        <div>
          <h3>Selected Expense:</h3>
          <p>
            User: {users[selectedExpense.user_id] ? `${users[selectedExpense.user_id].user_first_name} ${users[selectedExpense.user_id].user_last_name}` : 'User not found'} | Category: {categories[selectedExpense.category_id] ? categories[selectedExpense.category_id].category_name : 'Category not found'} | Cost: ${selectedExpense.expense_cost} | Description: {selectedExpense.expense_description}
          </p>
          {!editExpense && !isConfirmDelete && (
            <div>
              <button onClick={() => handleDeleteExpense(selectedExpense.expense_id)}>Delete Expense</button>
              <button onClick={() => setEditExpense(true)}>Edit Expense</button>
            </div>
          )}
          {editExpense && (
            <div>
              <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="">Select User</option>
                {Object.values(users).map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.user_first_name} {user.user_last_name}
                  </option>
                ))}
              </select>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Select Category</option>
                {Object.values(categories).map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
              <input type="text" value={cost} onChange={(e) => setCost(e.target.value)} />
              <button onClick={handleUpdateExpense}>Update Expense</button>
            </div>
          )}
          {message && <p>{message}</p>}
          {isSuccess && <button onClick={() => window.location.reload()}>Go back to Expense Management</button>}
          {isConfirmDelete && (
            <div>
              Are you sure?
              <button onClick={() => handleDeleteExpense(selectedExpense.expense_id)}>Confirm</button>
              <button onClick={() => setIsConfirmDelete(false)}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpenseManager;

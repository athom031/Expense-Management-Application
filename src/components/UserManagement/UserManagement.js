import './UserManagement.css';
import React, { useState } from 'react';
import ExistingUsers from './ExistingUsers';
import AddUser from './AddUser';

function UserManagement() {
  const [display, setDisplay] = useState('');

  const handleButtonClick = (value) => {
    setDisplay(value);
  };

  return (
    <div className="user-management-container">
      {display === '' && (
        <div className="user-management-button-container">
          <button className="user-management-button" onClick={() => handleButtonClick('existing')}>Existing Users</button>
          <button className="user-management-button" onClick={() => handleButtonClick('add')}>Add New User</button>
        </div>
      )}
      {display === 'existing' && <ExistingUsers />}
      {display === 'add' && <AddUser />}
    </div>
  );
}

export default UserManagement;

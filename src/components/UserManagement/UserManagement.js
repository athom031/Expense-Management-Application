// UserManagement.js
import React, { useEffect, useState } from 'react';
import { openDB, addRow, deleteRow, updateRow } from '../../utils/indexedDBUtils'; // Assuming the path is correct
import { USER_TABLE, USER_ID, USER_FIRST_NAME, USER_LAST_NAME } from '../../constants/indexedDBConstants';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    updateRow(USER_TABLE, {user_id: 2, user_first_name: 'Alex', user_last_name: 'Thomas'});

    useEffect(() => {
        const request = openDB(); // Open the database

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction([USER_TABLE], 'readonly');
            const objectStore = transaction.objectStore(USER_TABLE);
            const getUsersRequest = objectStore.getAll();

            getUsersRequest.onsuccess = function (event) {
                setUsers(event.target.result); // Set the users in the state
            };

            getUsersRequest.onerror = function (event) {
                console.error('Error retrieving users from the database');
            };
        };

        request.onerror = function (event) {
            console.error('Error opening database');
        };
    }, []);

    return (
        <div>
            <h2>User Management</h2>
            <ul>
                {users.map((user) => (
                    <li key={user[USER_ID]}>
                        {user[USER_FIRST_NAME]} {user[USER_LAST_NAME]}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;

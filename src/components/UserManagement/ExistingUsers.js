import React, { useEffect, useState } from 'react';
import { getAllRows, deleteRow, updateRow } from '../../utils/indexedDBUtils';
import { USER_TABLE } from '../../constants/indexedDBConstants';

const ExistingUsers = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [editUser, setEditUser] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const fetchUsers = () => {
        getAllRows(USER_TABLE).then((data) => setUsers(data));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setFirstName(user.user_first_name);
        setLastName(user.user_last_name);
        setEditUser(false);
        setMessage('');
        setIsSuccess(false);
    };

    const handleDeleteUser = (userId) => {
        if (isConfirmDelete) {
            deleteRow(USER_TABLE, userId);
            fetchUsers();
            setIsConfirmDelete(false);
            setSelectedUser(null);
            setMessage('');
            setIsSuccess(false);
        } else {
            setIsConfirmDelete(true);
            setEditUser(false);
            setMessage('');
            setIsSuccess(false);
        }
    };

    const handleUpdateUser = () => {
        if (firstName && lastName) {
            const updatedUser = { ...selectedUser, user_first_name: firstName, user_last_name: lastName };
            updateRow(USER_TABLE, updatedUser);
            fetchUsers();
            setSelectedUser(updatedUser);
            setEditUser(false);
            setMessage(`${firstName} ${lastName} updated successfully`);
            setIsSuccess(true);
        } else {
            setMessage('Please provide both first name and last name');
            setIsSuccess(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
                    {users.map((user) => (
                        <div key={user.user_id} onClick={() => handleUserClick(user)}>
                            {user.user_first_name} {user.user_last_name}
                        </div>
                    ))}
                </div>
                <div style={{ flex: 1 }}>
                    {selectedUser && (
                        <div>
                            <h3>Selected User:</h3>
                            <p>
                                {selectedUser.user_first_name} {selectedUser.user_last_name}
                            </p>
                            {!editUser && !isConfirmDelete && (
                                <div>
                                    <button onClick={() => handleDeleteUser(selectedUser.user_id)}>Delete User</button>
                                    <button onClick={() => setEditUser(true)}>Edit User</button>
                                </div>
                            )}
                            {editUser && (
                                <div>
                                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                    <button onClick={handleUpdateUser}>Update User</button>
                                </div>
                            )}
                            {message && <p>{message}</p>}
                            {isSuccess && (
                                <button onClick={() => window.location.reload()}>Go back to User Management</button>
                            )}
                            {isConfirmDelete && (
                                <div>
                                    Are you sure?
                                    <button onClick={() => handleDeleteUser(selectedUser.user_id)}>Confirm</button>
                                    <button onClick={() => setIsConfirmDelete(false)}>Cancel</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExistingUsers;

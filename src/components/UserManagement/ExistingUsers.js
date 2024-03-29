import React, { useEffect, useState } from 'react';
import { getAllRows, deleteRow, updateRow, getTotalExpenditureByUserId, deleteAllExpensesByUserId } from '../../utils/indexedDBUtils';
import { USER_TABLE } from '../../constants/indexedDBConstants';

const ExistingUsers = () => {
    const [users, setUsers] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [editUser, setEditUser] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [userExpenditure, setUserExpenditure] = useState({});

    const fetchUsers = async () => {
        const data = await getAllRows(USER_TABLE);
        const usersWithExpenditure = await Promise.all(
            Object.entries(data).map(async ([userID, user]) => {
                const totalExpenditure = await getTotalExpenditureByUserId(user.user_id);
                return { ...user, totalExpenditure };
            })
        );
        setUsers(usersWithExpenditure);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserClick = async (user) => {
        setSelectedUser(user[1]);
        setFirstName(user[1].user_first_name);
        setLastName(user[1].user_last_name);
        setEditUser(false);
        setMessage('');
        setIsSuccess(false);

        const totalExpenditure = await getTotalExpenditureByUserId(user[1].user_id);
        setUserExpenditure({ ...userExpenditure, [user[1].user_id]: totalExpenditure });
    };

    const handleDeleteUser = async (userID) => {
        if (isConfirmDelete) {
            deleteRow(USER_TABLE, userID);
            fetchUsers();
            setIsConfirmDelete(false);
            setSelectedUser(null);
            setMessage('');
            setIsSuccess(false);
            await deleteAllExpensesByUserId(userID);
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
        <div className="existing-users-container">
            <div className="existing-users-list">
                {Object.entries(users).map(([userID, user]) => (
                    <div className="existing-users-list-item" key={userID} onClick={() => handleUserClick([userID, user])}>
                        {user.user_first_name} {user.user_last_name} - {user.totalExpenditure !== undefined && user.totalExpenditure !== null ? user.totalExpenditure : 'Loading...'}
                    </div>
                ))}
            </div>
            <div className="selected-user-details">
                {selectedUser && (
                    <div>
                        <h3>Selected User:</h3>
                        <p>
                            {selectedUser.user_first_name} {selectedUser.user_last_name} - {userExpenditure[selectedUser.user_id] !== undefined && userExpenditure[selectedUser.user_id] !== null ? userExpenditure[selectedUser.user_id] : 'Loading...'}
                        </p>
                        {!editUser && !isConfirmDelete && (
                            <div className="user-buttons">
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
                            <div className="confirm-buttons">
                                Are you sure?
                                <button onClick={() => handleDeleteUser(selectedUser.user_id)}>Confirm</button>
                                <button onClick={() => setIsConfirmDelete(false)}>Cancel</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExistingUsers;

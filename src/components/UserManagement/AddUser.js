import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { USER_TABLE } from '../../constants/indexedDBConstants';
import { addRow } from '../../utils/indexedDBUtils';
import './UserManagement.css';

function AddUser() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const generateUserId = () => {
        return uuidv4();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (firstName && lastName) {
            const userId = generateUserId();

            addRow(
                {
                    user_id: userId,
                    user_first_name: firstName,
                    user_last_name: lastName
                },
                USER_TABLE
            );

            // Your logic to add the user to the database here
            // Set isSuccess to true after successfully adding the user to the database
            setIsSuccess(true);
            setMessage(`${firstName} ${lastName} added successfully`);
        } else {
            setMessage('Please provide both first name and last name');
        }
    };

    return (
        <div className="add-user-container">
            <h2>Add User</h2>
            <form className="add-user-form" onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </label>
                <label>
                    Last Name:
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </label>
                <button type="submit">Submit</button>
            </form>
            {message && <p className="message">{message}</p>}
            {isSuccess && (
                <button onClick={() => window.location.reload()}>Go back to User Management</button>
            )}
        </div>
    );
}

export default AddUser;

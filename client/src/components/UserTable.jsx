import React from 'react'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../services/userService';
import "../style/UserTable.css";

export default function UserTable() {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) {
            return; 
        }

        try {
            await deleteUser(id);
            await fetchUsers();    
        } catch (error) {
            console.error(error);
        }
    };


  return (
    <div className='container'>
        <h2>User Management</h2>

        <div className='table-container'>
            <Link to="/create" className='btn-add'>Add User</Link>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Gender</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key = {user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.gender}</td>
                            <td>{user.status}</td>
                            <td>
                                <Link to={`/edit/${user.id}`} className=" btn btn-edit">Edit</Link>
                                <button onClick={() => handleDelete(user.id)} className="btn btn-delete">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

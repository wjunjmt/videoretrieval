"use client";

import { useState, useEffect } from 'react';

// Simplified types for frontend
type User = {
    id: number;
    username: string;
    email: string;
    role: { name: string } | null;
    is_active: boolean;
};

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            // This would be replaced with a call to a proxied API route
            // const response = await fetch('/api/admin/users');
            const mockResponse = [
                { id: 1, username: 'admin', email: 'admin@example.com', role: { name: 'Super Admin' }, is_active: true },
            ];
            setUsers(mockResponse);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="bg-background-dark text-white min-h-screen p-8">
            <header className="mb-6">
                <h2 className="text-2xl font-bold">User & Permission Management</h2>
            </header>
            <div className="flex justify-end mb-4">
                <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg">Add User</button>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10">
                <table className="w-full text-left">
                    <thead className="bg-white/5">
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {isLoading ? (
                            <tr><td colSpan={5}>Loading...</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role?.name || 'N/A'}</td>
                                    <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                                    <td><button className="text-primary">Edit</button></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

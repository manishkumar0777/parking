'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Search, User, Mail, Phone, Calendar } from 'lucide-react';

interface UserData {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const results = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (res.ok) {
                setUsers(data.users);
                setFilteredUsers(data.users);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin"
                    className="p-2 rounded-full hover:bg-accent transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">View and manage registered users</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                {/* Toolbar */}
                <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="pl-9 pr-4 py-2 w-full rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                        Total Users: {users.length}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="px-6 py-3 font-medium text-muted-foreground">User</th>
                                <th className="px-6 py-3 font-medium text-muted-foreground">Contact</th>
                                <th className="px-6 py-3 font-medium text-muted-foreground">Role</th>
                                <th className="px-6 py-3 font-medium text-muted-foreground">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">ID: {user._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 space-y-1">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mail className="h-3.5 w-3.5" />
                                                {user.email}
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="h-3.5 w-3.5" />
                                                    {user.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

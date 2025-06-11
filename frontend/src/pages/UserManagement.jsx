import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null); // State to track which user's role is being updated
  const [deletingUserId, setDeletingUserId] = useState(null); // State to track which user is being deleted

  const { authFetch, user: currentUser } = useAuth(); // Get authFetch and current user from AuthContext

  // useCallback to memoize fetchUsers to avoid re-creating it on every render
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authFetch('/api/auth/users'); // Corrected API endpoint base: '/api/auth/users'
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [authFetch]); // Dependency array: re-create fetchUsers if authFetch changes

  useEffect(() => {
    fetchUsers(); // Call fetchUsers when component mounts or authFetch changes
  }, [fetchUsers]); // Dependency array: re-run effect if fetchUsers changes

  const handleRoleChange = async (userId, newRole) => {
    // Prevent changing your own role (or demoting yourself)
    if (userId === currentUser.id) {
      alert('You cannot change your own role from this interface. Log out and re-login for role changes to reflect.');
      return;
    }

    if (!window.confirm(`Are you sure you want to change this user's role to "${newRole}"?`)) {
      return;
    }

    setUpdatingUserId(userId); // Set loading state for this specific user button
    try {
      // Corrected API endpoint base: '/api/auth/users/${userId}/role'
      const response = await authFetch(`/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      // Backend should ideally return the updated user or a success message
      // No need to parse response.json() if your backend sends 200 OK with no body
      // or if you just update the state locally.
      // If your backend sends a message, you can parse it: const data = await response.json();

      // Update the user's role in the local state optimistically
      setUsers(prevUsers => prevUsers.map(user =>
        user._id === userId ? { ...user, role: newRole } : user
      ));
      alert(`User role updated to ${newRole} for ${users.find(u => u._id === userId)?.username || 'user'}!`);
    } catch (err) {
      console.error('Failed to update user role:', err);
      setError(err.message || 'Failed to update user role.');
    } finally {
      setUpdatingUserId(null); // Clear loading state
    }
  };

  const handleDeleteUser = async (userId, username) => {
    // Prevent deleting yourself
    if (userId === currentUser.id) {
      alert("You cannot delete your own account from this interface.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingUserId(userId); // Set loading state for this specific user button
    try {
      // Corrected API endpoint base: '/api/auth/users/${userId}'
      await authFetch(`/api/auth/users/${userId}`, {
        method: 'DELETE',
      });

      // Remove the user from the local state
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      alert(`User "${username}" deleted successfully!`);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError(err.message || 'Failed to delete user.');
    } finally {
      setDeletingUserId(null); // Clear loading state
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
        <p className="text-xl text-gray-600 animate-pulse">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-160px)] text-red-600 p-4">
        <p className="text-xl mb-4">{error}</p>
        <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Helmet>
        <title>Manage Users - Admin</title>
        <meta name="description" content="Admin panel to manage user roles and accounts." />
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8 animate-fade-in-down">
        Manage Users
      </h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No users found.</p>
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden animate-fade-in-up">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username} {currentUser.id === user._id && <span className="text-xs text-blue-500">(You)</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {/* Role Change Buttons */}
                    {user._id !== currentUser.id && ( // Cannot change current admin's role or delete self
                      <>
                        {user.role === 'user' ? (
                          <button
                            onClick={() => handleRoleChange(user._id, 'admin')}
                            className="text-purple-600 hover:text-purple-900 mr-4 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={updatingUserId === user._id}
                          >
                            {updatingUserId === user._id ? 'Updating...' : 'Make Admin'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(user._id, 'user')}
                            className="text-blue-600 hover:text-blue-900 mr-4 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={updatingUserId === user._id}
                          >
                            {updatingUserId === user._id ? 'Updating...' : 'Make User'}
                          </button>
                        )}
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteUser(user._id, user.username)}
                          className="text-red-600 hover:text-red-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={deletingUserId === user._id}
                        >
                          {deletingUserId === user._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </>
                    )}
                    {user._id === currentUser.id && ( // Display for current user (cannot change/delete)
                        <span className="text-gray-500 italic">Current User</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Edit, ExternalLink, Save, XCircle } from 'lucide-react'; // Added Save, XCircle icons

export default function AdminDashboard() {
  const { authFetch, user, userRole } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'users'
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [errorPosts, setErrorPosts] = useState(null);
  const [errorUsers, setErrorUsers] = useState(null);

  // States for Posts Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); // Number of posts per page
  const [totalPosts, setTotalPosts] = useState(0); // Total number of posts from backend
  const [totalPages, setTotalPages] = useState(0); // Total pages from backend

  // States for User Role Editing
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState(''); // Stores the selected new role for editing

  // Fetch Posts
  const fetchPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    setErrorPosts(null);
    try {
      // Pass pagination parameters to the backend
      const response = await authFetch(`/posts?page=${currentPage}&limit=${postsPerPage}`);
      setPosts(response.posts); // Access the 'posts' array from the response
      setTotalPosts(response.totalPosts); // Assuming backend sends total count
      setTotalPages(response.totalPages); // Assuming backend sends total pages
    } catch (err) {
      console.error('Error fetching posts:', err);
      setErrorPosts('Failed to fetch posts. ' + (err.message || ''));
    } finally {
      setIsLoadingPosts(false);
    }
  }, [authFetch, currentPage, postsPerPage]); // Add pagination states to dependencies

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setErrorUsers(null);
    try {
      const data = await authFetch('/users'); // New backend endpoint
      setUsers(data); // Assuming data is an array of users
    } catch (err) {
      console.error('Error fetching users:', err);
      setErrorUsers('Failed to fetch users. ' + (err.message || ''));
    } finally {
      setIsLoadingUsers(false);
    }
  }, [authFetch]);

  // Initial data fetch and re-fetch on tab change/pagination change
  useEffect(() => {
    if (userRole === 'admin') {
      if (activeTab === 'posts') {
        fetchPosts();
      } else if (activeTab === 'users') {
        fetchUsers();
      }
    }
  }, [userRole, activeTab, fetchPosts, fetchUsers]); // Re-fetch when activeTab changes

  // Handle Post Deletion
  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await authFetch(`/posts/${postId}`, { method: 'DELETE' });
        alert('Post deleted successfully!');
        fetchPosts(); // Refresh the list of posts
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post: ' + (err.message || ''));
      }
    }
  };

  // Handle User Deletion
  const handleDeleteUser = async (userId, username) => {
    if (user && user._id === userId) {
      alert("You cannot delete your own admin account through the dashboard.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      try {
        await authFetch(`/users/${userId}`, { method: 'DELETE' });
        alert('User deleted successfully!');
        fetchUsers(); // Refresh the list of users
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user: ' + (err.message || ''));
      }
    }
  };

  // Handle initiating user role edit
  const handleEditUserRoleClick = (userId, currentRole) => {
    setEditingUserId(userId);
    setNewRole(currentRole); // Pre-fill the dropdown with the current role
  };

  // Handle saving updated user role
  const handleSaveUserRole = async (userId) => {
    if (!newRole) {
      alert('Please select a role.');
      return;
    }
    if (user && user._id === userId && newRole !== 'admin') {
      alert("You cannot demote your own account to a non-admin role through the dashboard.");
      return;
    }

    try {
      await authFetch(`/users/${userId}`, { // Assuming PUT /api/users/:id for role update
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }), // Send the new role
      });
      alert('User role updated successfully!');
      fetchUsers(); // Refresh the user list
      setEditingUserId(null); // Exit editing mode
      setNewRole(''); // Clear selected role
    } catch (err) {
      console.error('Error updating user role:', err);
      alert('Failed to update user role: ' + (err.message || ''));
    }
  };

  // Handle canceling user role edit
  const handleCancelEdit = () => {
    setEditingUserId(null);
    setNewRole('');
  };

  // Pagination controls for posts
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 min-h-screen">
      <Helmet>
        <title>Admin Dashboard – MyBlog</title>
      </Helmet>

      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-3 text-lg font-medium rounded-l-lg transition-all duration-300
            ${activeTab === 'posts' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}
          `}
        >
          Manage Posts
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 text-lg font-medium rounded-r-lg transition-all duration-300
            ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}
          `}
        >
          Manage Users
        </button>
      </div>

      {/* Posts Management Section */}
      {activeTab === 'posts' && (
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl animate-fade-in transition-colors duration-300">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">All Blog Posts ({totalPosts} total)</h2>
          <div className="mb-4">
            <Link
              to="/admin/create-post"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
            >
              Add New Post
            </Link>
          </div>

          {isLoadingPosts ? (
            <p className="text-gray-600 dark:text-gray-300">Loading posts...</p>
          ) : errorPosts ? (
            <p className="text-red-600 dark:text-red-400">{errorPosts}</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No posts found.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Title</th>
                      <th className="py-3 px-6 text-left">Category</th>
                      <th className="py-3 px-6 text-left">Author</th>
                      <th className="py-3 px-6 text-center">Date</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-200 text-sm font-light">
                    {posts.map((post) => (
                      <tr key={post._id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          <Link to={`/blog/${post._id}`} className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                            {post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title}
                            <ExternalLink className="ml-2 w-4 h-4" />
                          </Link>
                        </td>
                        <td className="py-3 px-6 text-left">{post.category}</td>
                        <td className="py-3 px-6 text-left">{post.author || 'N/A'}</td>
                        <td className="py-3 px-6 text-center">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center space-x-3">
                            <Link
                              to={`/admin/edit-post/${post._id}`}
                              className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-700 transition duration-200"
                              title="Edit Post"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className="w-8 h-8 rounded-full bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-700 transition duration-200"
                              title="Delete Post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls for Posts */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors duration-300"
                  >
                    Previous
                  </button>
                  {pageNumbers.map(number => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`px-4 py-2 rounded-md transition-colors duration-300
                        ${number === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'}
                      `}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors duration-300"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Users Management Section */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl animate-fade-in transition-colors duration-300">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Manage Users</h2>

          {isLoadingUsers ? (
            <p className="text-gray-600 dark:text-gray-300">Loading users...</p>
          ) : errorUsers ? (
            <p className="text-red-600 dark:text-red-400">{errorUsers}</p>
          ) : users.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Username</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-center">Role</th>
                    <th className="py-3 px-6 text-center">Created At</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-200 text-sm font-light">
                  {users.map((userItem) => ( // Renamed to userItem to avoid conflict with `user` from useAuth
                    <tr key={userItem._id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{userItem.username}</td>
                      <td className="py-3 px-6 text-left">{userItem.email}</td>
                      <td className="py-3 px-6 text-center">
                        {editingUserId === userItem._id ? (
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="p-1 border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : (
                          <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                            userItem.role === 'admin' ? 'bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-purple-200' : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                          }`}>
                            {userItem.role}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {new Date(userItem.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center space-x-3">
                          {editingUserId === userItem._id ? (
                            <>
                              <button
                                onClick={() => handleSaveUserRole(userItem._id)}
                                className="w-8 h-8 rounded-full bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200 flex items-center justify-center hover:bg-green-200 dark:hover:bg-green-700 transition duration-200"
                                title="Save Role"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-200 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-500 transition duration-200"
                                title="Cancel Edit"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEditUserRoleClick(userItem._id, userItem.role)}
                              className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-700 transition duration-200"
                              title="Edit User Role"
                              disabled={user && user._id === userItem._id} // Disable edit for current admin
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(userItem._id, userItem.username)}
                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-700 transition duration-200"
                            title="Delete User"
                            disabled={user && user._id === userItem._id} // Disable delete for current admin
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
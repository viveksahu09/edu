import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, UserPlus, X, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  institution?: string;
}

export default function UserList() {
  const { user, token, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  // Debug what UserList receives from AuthContext
  console.log('UserList - Received from AuthContext:', {
    token: token ? 'exists' : 'missing',
    tokenLength: token?.length || 0,
    tokenStart: token?.substring(0, 20) + '...',
    isAuthenticated,
    userEmail: user?.email
  });

  // Debug localStorage contents
  console.log('UserList - localStorage contents:', {
    authToken: localStorage.getItem('authToken') ? 'exists' : 'missing',
    authTokenLength: localStorage.getItem('authToken')?.length || 0,
    authTokenStart: localStorage.getItem('authToken')?.substring(0, 20) + '...',
    user: localStorage.getItem('user') ? 'exists' : 'missing',
    token: localStorage.getItem('token') ? 'exists' : 'missing',
    tokenLength: localStorage.getItem('token')?.length || 0,
    tokenStart: localStorage.getItem('token')?.substring(0, 20) + '...'
  });

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, [token, isAuthenticated]); // Re-run when token or auth state changes

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Try multiple token sources, but exclude mock tokens
      const contextToken = token && !token.startsWith('mock-') ? token : null;
      const localStorageToken = localStorage.getItem('authToken');
      const fallbackToken = localStorage.getItem('token');
      
      // Filter out mock tokens
      const realLocalStorageToken = localStorageToken && !localStorageToken.startsWith('mock-') ? localStorageToken : null;
      const realFallbackToken = fallbackToken && !fallbackToken.startsWith('mock-') ? fallbackToken : null;
      
      console.log('Debug - Auth state:', { 
        isAuthenticated, 
        contextToken: contextToken ? 'exists' : 'missing',
        localStorageToken: realLocalStorageToken ? 'exists' : 'missing',
        fallbackToken: realFallbackToken ? 'exists' : 'missing',
        user: user?.name,
        hasMockToken: (token?.startsWith('mock-') || localStorageToken?.startsWith('mock-') || fallbackToken?.startsWith('mock-'))
      });
      
      // Use the first available REAL token (exclude mock tokens)
      const activeToken = contextToken || realLocalStorageToken || realFallbackToken;
      
      if (!activeToken) {
        console.log('Debug - No token found in any source, showing login error');
        setError('Please login to access user management');
        return;
      }
      
      console.log('Debug - Making API call with token from:', 
        contextToken ? 'AuthContext' : 
        localStorageToken ? 'localStorage(authToken)' : 
        'localStorage(token)');
      
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });

      console.log('Debug - API Response status:', response.status);
      console.log('Debug - API Response ok:', response.ok);

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication required. Please login again.');
        } else if (response.status === 403) {
          setError('Admin access required for user management.');
        } else {
          throw new Error('Failed to fetch users');
        }
        return;
      }

      const data = await response.json();
      console.log('Debug - API Response data:', data);
      console.log('Debug - Users array:', data.data?.users);
      console.log('Debug - Users array length:', data.data?.users?.length);
      
      setUsers(data.data.users || []);
      console.log('Debug - Users state updated, current users count:', users.length);
    } catch (err: any) {
      if (err.message.includes('Failed to fetch')) {
        setError('Cannot connect to backend server. Please check if the server is running.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      institution: user.institution || ''
    });
  };

  const handleSaveEdit = async (userId: string) => {
    try {
      // Use the same token fallback logic with mock token filtering
      const contextToken = token && !token.startsWith('mock-') ? token : null;
      const localStorageToken = localStorage.getItem('authToken');
      const fallbackToken = localStorage.getItem('token');
      const realLocalStorageToken = localStorageToken && !localStorageToken.startsWith('mock-') ? localStorageToken : null;
      const realFallbackToken = fallbackToken && !fallbackToken.startsWith('mock-') ? fallbackToken : null;
      const activeToken = contextToken || realLocalStorageToken || realFallbackToken;
      
      if (!activeToken) {
        setError('Authentication required');
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const updatedUser = await response.json();
      setUsers(users.map(u => u.id === userId ? updatedUser.data.user : u));
      setEditingUser(null);
      setEditForm({});
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    try {
      // Use the same token fallback logic with mock token filtering
      const contextToken = token && !token.startsWith('mock-') ? token : null;
      const localStorageToken = localStorage.getItem('authToken');
      const fallbackToken = localStorage.getItem('token');
      const realLocalStorageToken = localStorageToken && !localStorageToken.startsWith('mock-') ? localStorageToken : null;
      const realFallbackToken = fallbackToken && !fallbackToken.startsWith('mock-') ? fallbackToken : null;
      const activeToken = contextToken || realLocalStorageToken || realFallbackToken;
      
      if (!activeToken) {
        setError('Authentication required');
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      setUsers(users.filter(u => u.id !== userId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  // Count admin users
  const adminCount = users.filter(user => 
    user.role === "ADMIN" || user.role === "SUPER_ADMIN"
  ).length;
  const canCreateAdmin = adminCount < 3; // 3-admin limit system

  // Debug render state
  console.log('Debug - Render state:', {
    loading,
    error,
    usersCount: users.length,
    adminCount,
    isAuthenticated,
    hasUser: !!user
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total Users: {users.length} | Admins: {adminCount}/3
          </p>
        </div>
        <div className="flex gap-2">
          {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && canCreateAdmin && (
            <Link
              to="/admin/register"
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add Admin
            </Link>
          )}
          {adminCount < 3 && (
            <Link
              to="/admin/users/add"
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add User
            </Link>
          )}
        </div>
      </div>

      {adminCount >= 3 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Admin Limit Reached:</strong> Maximum 3 admin accounts allowed ({adminCount}/3).
          </p>
        </div>
      )}
      {adminCount > 0 && adminCount < 3 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Admin Count:</strong> {adminCount}/3 admin accounts available.
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading users...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">Error: {error}</p>
          {error.includes('Please login') && (
            <div className="mt-2">
              <Link 
                to="/login" 
                className="text-sm text-red-600 underline hover:text-red-800"
              >
                Go to Login
              </Link>
            </div>
          )}
          {error.includes('Admin access required') && (
            <div className="mt-2">
              <p className="text-xs text-red-600">
                Only admin users can access user management.
              </p>
            </div>
          )}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((userItem: User) => {
                const roleColor = userItem.role.toLowerCase() === "admin" ? "bg-red-100 text-red-800" :
                                userItem.role.toLowerCase() === "teacher" ? "bg-blue-100 text-blue-800" :
                                userItem.role.toLowerCase() === "researcher" ? "bg-purple-100 text-purple-800" :
                                "bg-green-100 text-green-800";
                
                const isEditing = editingUser === userItem.id;
                
                return (
                <tr key={userItem.id} className={userItem.role.toLowerCase() === "admin" ? "bg-red-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="px-2 py-1 border rounded"
                      />
                    ) : (
                      <div className="flex items-center">
                        {userItem.name}
                        {userItem.role === "SUPER_ADMIN" && (
                          <span className="ml-2 text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-1 rounded">SUPER ADMIN</span>
                        )}
                        {userItem.role === "ADMIN" && (
                          <span className="ml-2 text-xs text-red-600 font-semibold">ADMIN</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="px-2 py-1 border rounded"
                      />
                    ) : (
                      userItem.email
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <select
                        value={editForm.role || ''}
                        onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="researcher">Researcher</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleColor}`}>
                        {userItem.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <button 
                            onClick={() => handleSaveEdit(userItem.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          {userItem.role !== "SUPER_ADMIN" && (
                            <button 
                              onClick={() => handleEdit(userItem)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                          )}
                          {userItem.role !== "SUPER_ADMIN" && (
                            <button 
                              onClick={() => handleDelete(userItem.id, userItem.name)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

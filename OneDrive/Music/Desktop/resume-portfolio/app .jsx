import React, { useState, useEffect, useCallback } from 'react';

// --- API URL ---
// In production, this should point to your Render backend
const API_BASE_URL = 'https://task-manager-xyz1.onrender.com'; // Replace with your actual Render URL

// --- Helper Components ---

// Simple loading spinner
const Spinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

// Generic modal component
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
    <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {children}
    </div>
  </div>
);

// --- Main Application Components ---

/**
 * Login/Signup Form Component
 * Handles both user registration and login.
 */
const AuthForm = ({ isLogin, setToken, setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Email and password are required.');
      setIsLoading(false);
      return;
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred.');
      }
      
      // On success, save token and trigger re-render in App
      setToken(data.token);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          {isLogin ? 'Welcome Back!' : 'Create an Account'}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {isLogin ? 'Sign in to continue to your dashboard.' : 'Get started with your new account.'}
        </p>
      </div>
      <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 flex justify-center items-center transition"
            >
              {isLoading ? <Spinner /> : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setView(isLogin ? 'signup' : 'login')} className="font-medium text-indigo-600 hover:text-indigo-500">
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

/**
 * Task Form Component
 * Used for both creating and editing tasks within a modal.
 */
const TaskForm = ({ token, taskToEdit, onTaskSaved, onCancel }) => {
    const [title, setTitle] = useState(taskToEdit?.title || '');
    const [description, setDescription] = useState(taskToEdit?.description || '');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required.');
            return;
        }
        
        setIsLoading(true);
        setError('');

        const isEditing = !!taskToEdit;
        const endpoint = isEditing ? `/api/tasks/${taskToEdit._id}` : '/api/tasks';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to save task.');
            }
            onTaskSaved();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">{taskToEdit ? 'Edit Task' : 'Create New Task'}</h3>
             <div>
                <label htmlFor="title" className="text-sm font-medium text-gray-700 block mb-1">Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Deploy the new feature"
                />
            </div>
            <div>
                <label htmlFor="description" className="text-sm font-medium text-gray-700 block mb-1">Description (Optional)</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add more details about the task..."
                />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                    Cancel
                </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center">
                    {isLoading ? <Spinner /> : 'Save Task'}
                </button>
            </div>
        </form>
    );
};


/**
 * Dashboard Component
 * Main view after a user is authenticated.
 */
const Dashboard = ({ token, onLogout }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
        const [userResponse, tasksResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/api/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch(`${API_BASE_URL}/api/tasks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
        ]);

        if (!userResponse.ok || !tasksResponse.ok) {
            throw new Error('Failed to fetch dashboard data. Please log in again.');
        }

        const userData = await userResponse.json();
        const tasksData = await tasksResponse.json();

        setUser(userData);
        setTasks(tasksData);

    } catch (err) {
        setError(err.message);
        if (err.message.includes('log in again')) {
          setTimeout(onLogout, 2000); // Log out on auth error
        }
    } finally {
        setIsLoading(false);
    }
  }, [token, onLogout]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleOpenCreateModal = () => {
      setTaskToEdit(null);
      setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
      setTaskToEdit(task);
      setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setTaskToEdit(null);
  };

  const handleTaskSaved = () => {
      handleCloseModal();
      fetchDashboardData(); // Refetch tasks
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to delete task.');
            fetchDashboardData();
        } catch (err) {
            alert(err.message);
        }
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(filter.toLowerCase()) ||
    task.description.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Spinner />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
              <span className="text-gray-600 hidden sm:block">Welcome, {user?.email}</span>
              <button onClick={onLogout} className="text-sm font-medium bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition">
                  Logout
              </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">Your Tasks ({filteredTasks.length})</h2>
                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
                    <input 
                        type="text"
                        placeholder="Search tasks..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button onClick={handleOpenCreateModal} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                         </svg>
                        New Task
                    </button>
                </div>
            </div>
        </div>
        
        <div className="space-y-4">
            {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                    <div key={task._id} className="bg-white p-5 rounded-lg shadow-sm flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-800">{task.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                        </div>
                        <div className="flex-shrink-0 flex gap-2 ml-4">
                            <button onClick={() => handleOpenEditModal(task)} className="text-indigo-600 hover:text-indigo-800">Edit</button>
                            <button onClick={() => handleDelete(task._id)} className="text-red-600 hover:text-red-800">Delete</button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center bg-white p-8 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-gray-700">No tasks found.</h3>
                    <p className="text-gray-500 mt-1">Click "New Task" to get started!</p>
                </div>
            )}
        </div>
      </main>
      
      {isModalOpen && (
          <Modal onClose={handleCloseModal}>
              <TaskForm 
                  token={token} 
                  taskToEdit={taskToEdit}
                  onTaskSaved={handleTaskSaved}
                  onCancel={handleCloseModal}
              />
          </Modal>
      )}

    </div>
  );
};


/**
 * Main App Component
 * Manages view state (login, signup, dashboard) and authentication token.
 */
function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  // Default view is 'login', could be 'signup' or 'dashboard'
  const [view, setView] = useState('login');

  // Effect to handle token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      setView('dashboard');
    } else {
      localStorage.removeItem('authToken');
      // Only switch to login if they were on the dashboard
      if (view === 'dashboard') {
        setView('login');
      }
    }
  }, [token, view]);

  const handleLogout = () => {
    setToken(null);
  };
  
  // Render component based on view state
  const renderView = () => {
    switch(view) {
      case 'dashboard':
        return token ? <Dashboard token={token} onLogout={handleLogout} /> : <AuthForm isLogin={true} setToken={setToken} setView={setView} />;
      case 'signup':
        return <AuthForm isLogin={false} setToken={setToken} setView={setView} />;
      case 'login':
      default:
        return <AuthForm isLogin={true} setToken={setToken} setView={setView} />;
    }
  }

  return (
    <>
      <div className="App">
        {renderView()}
      </div>
    </>
  );
}

export default App;
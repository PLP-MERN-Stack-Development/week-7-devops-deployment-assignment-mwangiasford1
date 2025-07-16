import React, { useState, useEffect } from 'react';
import './App.css';
import Task from './components/Task';
import Login from './components/Login';
import Register from './components/Register';
import { itemsAPI } from './services/api';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: ''
  });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [showAuth, setShowAuth] = useState('login'); // 'login' or 'register'
  
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.getAll();
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await itemsAPI.create(newTask);
      setTasks([response.data, ...tasks]);
      setNewTask({ title: '', description: '' });
      setIsAddingTask(false);
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  // Update task
  const handleUpdateTask = async (id, updatedData) => {
    try {
      const response = await itemsAPI.update(id, updatedData);
      setTasks(tasks.map(task => 
        task._id === id ? response.data : task
      ));
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await itemsAPI.delete(id);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setTasks([]);
    setError(null);
  };

  // Load tasks when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchTasks();
    } else if (!isAuthenticated && !authLoading) {
      setTasks([]);
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="app">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  // Show authentication if user is not logged in
  if (!isAuthenticated) {
    return (
      <div className="app">
        {showAuth === 'login' ? (
          <Login onSwitchToRegister={() => setShowAuth('register')} />
        ) : (
          <Register onSwitchToLogin={() => setShowAuth('login')} />
        )}
      </div>
    );
  }

  // Main app content for authenticated users
  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <div className="loading">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <div className="header-content">
            <div>
              <h1>Task Manager</h1>
              <p>Manage your tasks with ease</p>
            </div>
            <div className="user-section">
              <span className="user-name">Welcome, {user?.name || 'User'}!</span>
              <button onClick={handleLogout} className="btn btn-secondary logout-btn">
                Logout
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="add-task-section">
          {!isAddingTask ? (
            <button 
              onClick={() => setIsAddingTask(true)}
              className="btn btn-primary add-task-btn"
            >
              + Add New Task
            </button>
          ) : (
            <form onSubmit={handleCreateTask} className="add-task-form">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="task-input"
                required
              />
              <textarea
                placeholder="Task description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="task-textarea"
              />
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Add Task
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTask({ title: '', description: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="tasks-section">
          <h2>Your Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks yet. Create your first task!</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map(task => (
                <Task
                  key={task._id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import './Task.css';

const Task = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    completed: task.completed
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate(task._id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description,
      completed: task.completed
    });
    setIsEditing(false);
  };

  const handleToggleComplete = async () => {
    try {
      await onUpdate(task._id, { ...editData, completed: !editData.completed });
      setEditData(prev => ({ ...prev, completed: !prev.completed }));
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  if (isEditing) {
    return (
      <div className="task-item editing">
        <div className="task-content">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="task-title-input"
            placeholder="Task title"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="task-description-input"
            placeholder="Task description"
          />
        </div>
        <div className="task-actions">
          <button onClick={handleSave} className="btn btn-save">Save</button>
          <button onClick={handleCancel} className="btn btn-cancel">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <span className="task-date">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="task-description">{task.description}</p>
      </div>
      <div className="task-actions">
        <button
          onClick={handleToggleComplete}
          className={`btn ${task.completed ? 'btn-undo' : 'btn-complete'}`}
        >
          {task.completed ? 'Undo' : 'Complete'}
        </button>
        <button onClick={handleEdit} className="btn btn-edit">Edit</button>
        <button onClick={() => onDelete(task._id)} className="btn btn-delete">Delete</button>
      </div>
    </div>
  );
};

export default Task; 
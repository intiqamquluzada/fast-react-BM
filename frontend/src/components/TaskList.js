import React, { useState, useEffect, useContext } from "react";
import { tasksAPI } from "../services/api";
import TaskForm from "./TaskForm";
import { AuthContext } from "../context/AuthContext";

const TaskList = () => {
  const { token, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasks = await tasksAPI.getTasks(token);
      setTasks(tasks);
    } catch (error) {
      setError("Error loading tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await tasksAPI.deleteTask(id, token);
      loadTasks();
    } catch (error) {
      setError("Error deleting task");
    }
  };

  const handleUpdate = async (id, task) => {
    try {
      await tasksAPI.updateTask(id, task, token);
      loadTasks();
      setSelectedTask(null);
    } catch (error) {
      setError("Error updating task");
    }
  };

  const handleCreate = async (task) => {
    try {
      await tasksAPI.createTask(task, token);
      loadTasks();
      setShowForm(false);
    } catch (error) {
      setError("Error creating task");
    }
  };

  const toggleComplete = async (task) => {
    await handleUpdate(task.id, { completed: !task.completed });
  };

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="task-list">
      <div className="topbar">
        <button className="logout-btn" onClick={logout}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path fill="#fff" d="M16 13v-2H7V8l-5 4 5 4v-3h9z"/>
            <path fill="#fff" d="M20 3H12v2h8v14h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>
      <div className="header">
        <h1>Task Management</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Add New Task
        </button>
      </div>

      {showForm && (
        <div className="modal" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <TaskForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {selectedTask && (
        <div className="modal" onClick={() => setSelectedTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <TaskForm
              task={selectedTask}
              onSubmit={(task) => handleUpdate(selectedTask.id, task)}
              onCancel={() => setSelectedTask(null)}
            />
          </div>
        </div>
      )}

      <div className="tasks">
        {tasks.length === 0 ? (
          <div className="no-tasks">No tasks found. Create your first task!</div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${task.completed ? "completed" : ""}`}
            >
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                <span
                  className={`status ${task.completed ? "completed" : "pending"}`}
                >
                  {task.completed ? "Completed" : "Pending"}
                </span>
              </div>
              <div className="task-actions">
                <button
                  onClick={() => setSelectedTask(task)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleComplete(task)}
                  className={task.completed ? "btn-pending" : "btn-complete"}
                >
                  {task.completed ? "Mark Pending" : "Mark Complete"}
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList; 
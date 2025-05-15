// src/services/api.js
export const API_BASE = "https://fast-react-bm.onrender.com";

export const tasksAPI = {
  async getTasks(token) {
    const response = await fetch(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  },
  async createTask(task, token) {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(task)
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  },
  async updateTask(id, task, token) {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(task)
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
  },
  async deleteTask(id, token) {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to delete task");
  },
};

export const authAPI = {
  async login(email, password) {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },
  async register(email, password) {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error("Register failed");
    return response.json();
  }
};
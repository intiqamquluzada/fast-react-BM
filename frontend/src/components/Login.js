import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { setToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = await authAPI.login(email, password);
      setToken(data.access_token);
      navigate("/tasks");
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      <div className="auth-switch">
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </div>
    </form>
  );
};

export default Login;
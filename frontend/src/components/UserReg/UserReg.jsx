import React, { useState } from "react";
import axios from "axios";
import "./UserReg.css";
import {useNavigate} from 'react-router-dom';

export default function UserRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); // default role
  const [message, setMessage] = useState("");
  const navigate=useNavigate();

  const formData = {
    email,
    password,
    role,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/users/", formData);
      setMessage("User Created: " + res.data.email);
      setEmail("");
      setPassword("");
      setRole("customer");
      navigate('/login')
    } catch (error) {
      console.error(error);
      setMessage("User creation failed");
    }
  };

  return (
    <div className="user-reg-div1">
      <h2 className="user-reg-h1">User Registration</h2>
      <form className="user-reg-form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="user-reg-email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="user-reg-password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="user-reg-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="user-reg-submit">
          Register User
        </button>
      </form>

      {message && <p className="user-reg-message">{message}</p>}
      <a
  href="#"
  onClick={(e) => {
    e.preventDefault(); 
    navigate("/login"); 
}}
>
  Already have an account? Login
</a>

    </div>
  );
}

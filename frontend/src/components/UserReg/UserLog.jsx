import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserReg.css";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8000/api/login/",
        { email, password },
        { withCredentials: true } 
      );

      if (res.data && res.data.role) {
        setMessage("✅ Login successful!");

        setTimeout(() => {
          res.data.role === "admin"
            ? navigate("/admin")
            : navigate("/plans");
        }, 1000);
      } else {
        setMessage("❌ Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Login failed");
    }
  };

  return (
    <div className="user-reg-div1">
      <h2 className="user-reg-h1">User Login</h2>
      <form className="user-reg-form" onSubmit={handleLogin}>
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

        <button type="submit" className="user-reg-submit">Login</button>
      </form>

      {message && <p className="user-reg-message">{message}</p>}

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
        className="user-reg-login-link"
      >
        Don’t have an account? Register
      </a>
    </div>
  );
}

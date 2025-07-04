import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserReg.css"; // Reuse existing CSS structure

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [stripeId, setStripeId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get("http://localhost:8000/api/users", {
        params: {
          email: email,
          stripe_id: stripeId,
        },
      });

      if (res.data && res.data.email === email) {
        setMessage("✅ Login successful!");
        
        setTimeout(() => navigate("/plans"), 1000);
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
          type="text"
          className="user-reg-stripe-id"
          placeholder="Enter Stripe ID"
          value={stripeId}
          onChange={(e) => setStripeId(e.target.value)}
          required
        />
        <button type="submit" className="user-reg-submit">
          Login
        </button>
      </form>
      {message && <p className="user-reg-message">{message}</p>}
      <a className="user-reg-login-link" onClick={() => navigate("/")}>
        Don’t have an account? Register
      </a>
    </div>
  );
}

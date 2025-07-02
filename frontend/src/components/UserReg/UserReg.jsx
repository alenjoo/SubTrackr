import React, { useState } from "react";
import axios from "axios";
import "./UserReg.css"; 

export default function UserRegister() {
  const [email, setEmail] = useState("");
  const [stripeId, setStripeId] = useState("");
  const [message, setMessage] = useState("");

  const formData = {
    email: email,
    stripe_customer_id: stripeId,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/users/", formData);
      setMessage("User Created: " + res.data.email);
      setEmail("");
      setStripeId("");
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
          placeholder="Enter email address"
          className="user-reg-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter Stripe ID"
          className="user-reg-stripe-id"
          value={stripeId}
          onChange={(e) => setStripeId(e.target.value)}
          required
        />
        <button type="submit" className="user-reg-submit">
          Register User
        </button>
      </form>
      {message && <p className="user-reg-message">{message}</p>}
    </div>
  );
}

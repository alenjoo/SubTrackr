import React, { useState } from "react";
import axios from "axios";
import "./AdminPlans.css";

export default function PlanForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    interval: "Monthly",
    api_quota: "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/plans/", form);
      onSuccess();
      setForm({ name: "", price: "", interval: "monthly", api_quota: "", description: "" });
    } catch (err) {
      console.error("Failed to create plan:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h4>Create New Plan</h4>
      <input name="name" placeholder="Plan Name" value={form.name} onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price ($)" value={form.price} onChange={handleChange} required />
      <select name="interval" value={form.interval} onChange={handleChange}>
        <option value="Monthly">Monthly</option>
        <option value="Yearly">Yearly</option>
      </select>
      <input name="api_quota" type="number" placeholder="API Quota" value={form.api_quota} onChange={handleChange} required />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <button type="submit">Create Plan</button>
    </form>
  );
}

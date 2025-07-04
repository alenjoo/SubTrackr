import React from "react";
import axios from "axios";
import "./AdminPlans.css";

export default function PlanList({ plans, onPlanChange }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/plans/${id}`);
      onPlanChange();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div>
      <h4>Existing Plans</h4>
      <ul className="admin-plan-list">
        {plans.map((plan) => (
          <li key={plan.id} className="admin-plan-item">
            <div>
              <strong>{plan.name}</strong> – ${plan.price} / {plan.interval} – {plan.api_quota} calls
            </div>
            <button onClick={() => handleDelete(plan.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

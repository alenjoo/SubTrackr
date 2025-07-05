import React, { useEffect, useState } from "react";
import PlanForm from "./PlanForm";
import PlanList from "./PlanList";
import axios from "axios";
import "./AdminPlans.css";

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [subscriberMap, setSubscriberMap] = useState({});

  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/get-plan/");
      setPlans(res.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin-subscribers/",  {
  withCredentials: true, // ✅ Required for Django to recognize the session
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': await getCsrfToken() // ✅ if CSRF protection is enabled
  }
});

      // Convert to map: { plan_id: [email, email...] }
      const map = {};
      res.data.forEach((entry) => {
        map[entry.plan_id] = entry.subscribers.map((s) => s.email);
      });
      setSubscriberMap(map);
    } catch (err) {
      console.error("Failed to fetch subscriber data", err);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchSubscribers();
  }, []);

  const handlePlanCreated = () => {
    fetchPlans();
    fetchSubscribers();
  };
async function getCsrfToken() {
  const response = await axios.get("http://localhost:8000/api/csrf/", {
    withCredentials: true,
  });
  return response.data.csrfToken;
}

  return (
    <div className="admin-container">
      <h2 className="admin-title">🧩 Manage Plans</h2>
      <PlanForm onSuccess={handlePlanCreated} />
      <hr />
      <div className="admin-plan-list">
        {plans.map((plan) => (
          <div className="admin-plan-card" key={plan.id}>
            <h3>{plan.name}</h3>
            <p>{plan.description}</p>
            <p>💰 ${plan.price} / {plan.interval}</p>
            <p>📦 API Quota: {plan.api_quota}</p>
            <h4>👥 Subscribers:</h4>
            {subscriberMap[plan.id]?.length > 0 ? (
              <ul>
                {subscriberMap[plan.id].map((email, i) => (
                  <li key={i}>📧 {email}</li>
                ))}
              </ul>
            ) : (
              <p className="admin-no-subscribers">No subscribers yet</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

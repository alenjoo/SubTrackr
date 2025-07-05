import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerPlans.css";

export default function CustomerPlans() {
  const [availablePlans, setAvailablePlans] = useState([]);
  const [subscribedPlans, setSubscribedPlans] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAvailablePlans();
    fetchSubscribedPlans();
  }, []);

  const fetchAvailablePlans = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/customer-plans/");
      setAvailablePlans(res.data);
    } catch (error) {
      console.error("Error fetching available plans", error);
    }
  };

  const fetchSubscribedPlans = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/my-subscriptions/", {
        withCredentials: true
      });
      setSubscribedPlans(res.data);
    } catch (error) {
      console.error("Error fetching subscriptions", error);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/subscribe/",
        { plan_id: planId },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": await getCsrfToken(),
          },
        }
      );

      setMessage(res.data.message);
      fetchSubscribedPlans(); // Refresh list
    } catch (err) {
      console.error("Subscription error", err);
      setMessage("❌ Subscription failed");
    }
  };

  async function getCsrfToken() {
    const response = await axios.get("http://localhost:8000/api/csrf/", {
      withCredentials: true,
    });
    return response.data.csrfToken;
  }

  return (
    <div className="cust-plan-container">
      <h2 className="cust-plan-title">Available Plans</h2>
      {availablePlans.length === 0 ? (
        <p>No plans available.</p>
      ) : (
        <div className="cust-plan-list">
          {availablePlans.map((plan) => (
            <div className="cust-plan-card" key={plan.id}>
              <h3 className="cust-plan-name">{plan.name}</h3>
              <p className="cust-plan-desc">{plan.description}</p>
              <p className="cust-plan-price">
                💰 ${plan.price} / {plan.interval}
              </p>
              <p className="cust-plan-quota">📦 {plan.api_quota} API calls</p>
              <button
                className="cust-plan-subscribe"
                onClick={() => handleSubscribe(plan.id)}
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      )}

      <hr />

      <h2 className="cust-plan-title">Your Subscribed Plans</h2>
      {subscribedPlans.length === 0 ? (
        <p>You haven’t subscribed to any plans yet.</p>
      ) : (
        <div className="cust-plan-list">
          {subscribedPlans.map((plan) => (
            <div className="cust-plan-card" key={plan.id}>
              <h3 className="cust-plan-name">{plan.name}</h3>
              <p className="cust-plan-desc">{plan.description}</p>
              <p className="cust-plan-price">
                💰 ${plan.price} / {plan.interval}
              </p>
              <p className="cust-plan-quota">📦 {plan.api_quota} API calls</p>
              <p className="cust-plan-owner">👤 Owner: {plan.owner_email}</p>
            </div>
          ))}
        </div>
      )}
      {message && <p className="cust-plan-message">{message}</p>}
    </div>
  );
}

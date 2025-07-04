import React, { useEffect, useState } from "react";
import PlanForm from "./PlanForm";
import PlanList from "./PlanList";
import axios from "axios";
import "./AdminPlans.css";

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);

  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/get-plan/");
      setPlans(res.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePlanCreated = () => {
    fetchPlans();
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">🧩 Manage Plans</h2>
      <PlanForm onSuccess={handlePlanCreated} />
      <hr />
      <PlanList plans={plans} onPlanChange={fetchPlans} />
    </div>
  );
}

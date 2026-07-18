import React from "react";
import {
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaChartLine,
  FaCalendarCheck,
} from "react-icons/fa";

function Dashboard({
  totalEmployees,
  departments,
  totalSalary,
  averageSalary,
  pendingLeaves = 0,
}) {
  const cards = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: <FaUsers />,
    },
    {
      title: "Departments",
      value: departments,
      icon: <FaBuilding />,
    },
    {
      title: "Salary Budget",
      value: `₹${totalSalary.toLocaleString()}`,
      icon: <FaMoneyBillWave />,
    },
    {
      title: "Average Salary",
      value: `₹${averageSalary.toLocaleString()}`,
      icon: <FaChartLine />,
    },
    {
      title: "Pending Leaves",
      value: pendingLeaves,
      icon: <FaCalendarCheck />,
    },
  ];

  return (
    <div className="dashboard">

      <h2 className="dashboard-title">
        Dashboard Overview
      </h2>

      <div className="stats">

        {cards.map((card, index) => (
          <div className="card" key={index}>

            <div className="card-icon">
              {card.icon}
            </div>

            <div className="card-content">
              <h3>{card.value}</h3>
              <p>{card.title}</p>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Dashboard;
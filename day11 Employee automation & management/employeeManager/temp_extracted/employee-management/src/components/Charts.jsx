import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Charts({ employees }) {
  // Count employees by department
  const departmentData = employees.reduce((acc, emp) => {
    const existing = acc.find(
      (item) => item.name === emp.department
    );

    if (existing) {
      existing.value += 1;
    } else {
      acc.push({
        name: emp.department,
        value: 1,
      });
    }

    return acc;
  }, []);

  const COLORS = [
    "#3B82F6",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ];

  return (
    <div className="chart-card">
      <h2>📊 Department Overview</h2>

      {departmentData.length === 0 ? (
        <p>No employee data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={departmentData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >
              {departmentData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default Charts;
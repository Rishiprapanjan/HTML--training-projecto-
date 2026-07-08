import React from "react";
import EmployeeCard from "./EmployeeCard";

function EmployeeList({ employees, onEdit, onDelete }) {
  return (
    <div className="employee-list">

      <h2>📋 Employee List</h2>

      {employees.length === 0 ? (
        <p className="no-data">No employees found.</p>
      ) : (
        <div className="employee-grid">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default EmployeeList;
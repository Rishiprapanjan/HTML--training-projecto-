import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function EmployeeCard({ employee, onEdit, onDelete }) {
  return (
    <div className="employee-card">

      <img
        src={`https://ui-avatars.com/api/?name=${employee.name}&background=3b82f6&color=fff&size=128`}
        alt={employee.name}
      />

      <h3>{employee.name}</h3>

      <span className="department">
        {employee.department}
      </span>

      <p>
        <strong>Designation:</strong><br />
        {employee.designation}
      </p>

      <p>
        <strong>Email:</strong><br />
        {employee.email}
      </p>

      <p>
        <strong>Phone:</strong><br />
        {employee.phone}
      </p>

      <h2 className="salary">
        ₹{Number(employee.salary).toLocaleString()}
      </h2>

      <div className="actions">

        <button
          className="edit-btn"
          onClick={() => onEdit(employee)}
        >
          <FaEdit /> Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(employee.id)}
        >
          <FaTrash /> Delete
        </button>

      </div>

    </div>
  );
}

export default EmployeeCard;
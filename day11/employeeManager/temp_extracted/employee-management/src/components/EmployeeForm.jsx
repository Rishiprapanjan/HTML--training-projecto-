import React, { useState, useEffect } from "react";

function EmployeeForm({ onSave, editEmployee }) {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
  });

  useEffect(() => {
    if (editEmployee) {
      setEmployee(editEmployee);
    }
  }, [editEmployee]);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !employee.name ||
      !employee.email ||
      !employee.phone ||
      !employee.department ||
      !employee.designation ||
      !employee.salary
    ) {
      alert("Please fill all fields.");
      return;
    }

    onSave(employee);

    setEmployee({
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      salary: "",
    });
  };

  return (
    <div className="form-section">

      <h2>
        {editEmployee ? "✏️ Edit Employee" : "➕ Add Employee"}
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={employee.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={employee.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={employee.phone}
          onChange={handleChange}
        />

        <select
          name="department"
          value={employee.department}
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          <option>IT</option>
          <option>HR</option>
          <option>Finance</option>
          <option>Marketing</option>
          <option>Sales</option>
        </select>

        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={employee.designation}
          onChange={handleChange}
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={employee.salary}
          onChange={handleChange}
        />

        <button className="btn" type="submit">
          {editEmployee ? "Update Employee" : "Add Employee"}
        </button>

      </form>

    </div>
  );
}

export default EmployeeForm;
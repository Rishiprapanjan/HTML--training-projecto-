import React, { useState, useEffect } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
// import Charts from "./components/Charts";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";

function App() {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "John Smith",
            email: "john@gmail.com",
            phone: "9876543210",
            department: "IT",
            designation: "Frontend Developer",
            salary: 60000,
          },
          {
            id: 2,
            name: "Emma Wilson",
            email: "emma@gmail.com",
            phone: "9876543211",
            department: "HR",
            designation: "HR Manager",
            salary: 55000,
          },
        ];
  });

  const [search, setSearch] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  // Add / Update Employee
  const saveEmployee = (employee) => {
    if (editEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === employee.id ? employee : emp
        )
      );
      setEditEmployee(null);
    } else {
      setEmployees([
        ...employees,
        {
          ...employee,
          id: Date.now(),
        },
      ]);
    }
  };

  // Delete Employee
  const deleteEmployee = (id) => {
    if (window.confirm("Delete this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  // Search
  const filteredEmployees = employees.filter((emp) =>
    (
      emp.name +
      emp.department +
      emp.designation +
      emp.email
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Dashboard Statistics
  const totalEmployees = employees.length;

  const departments = [
    ...new Set(employees.map((e) => e.department)),
  ].length;

  const totalSalary = employees.reduce(
    (sum, emp) => sum + Number(emp.salary),
    0
  );

  const averageSalary =
    totalEmployees === 0
      ? 0
      : Math.round(totalSalary / totalEmployees);

  return (
    <div className="app">

      {/* <Sidebar /> */}

      <div className="main">

        <Navbar
          search={search}
          setSearch={setSearch}
        />

        <Dashboard
          totalEmployees={totalEmployees}
          departments={departments}
          totalSalary={totalSalary}
          averageSalary={averageSalary}
        />

        {/* <Charts employees={employees} /> */}

        <EmployeeForm
          onSave={saveEmployee}
          editEmployee={editEmployee}
        />

        <EmployeeList
          employees={filteredEmployees}
          onEdit={setEditEmployee}
          onDelete={deleteEmployee}
        />

      </div>

    </div>
  );
}

export default App;
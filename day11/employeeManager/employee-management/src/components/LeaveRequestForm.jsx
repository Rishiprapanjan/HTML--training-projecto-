import React, { useState, useEffect } from "react";

function LeaveRequestForm({ employees, onSubmit, selectedEmployeeId, setSelectedEmployeeId }) {
  const [leave, setLeave] = useState({
    employeeId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    if (selectedEmployeeId) {
      setLeave((prev) => ({
        ...prev,
        employeeId: selectedEmployeeId,
      }));
    }
  }, [selectedEmployeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave({
      ...leave,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !leave.employeeId ||
      !leave.leaveType ||
      !leave.startDate ||
      !leave.endDate ||
      !leave.reason
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const employee = employees.find((emp) => emp.id === leave.employeeId);
    if (!employee) {
      alert("Selected employee not found.");
      return;
    }

    onSubmit({
      ...leave,
      employeeName: employee.name,
      id: Date.now().toString(),
      status: "Pending",
    });

    setLeave({
      employeeId: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
    });

    if (setSelectedEmployeeId) {
      setSelectedEmployeeId(null);
    }
  };

  return (
    <div className="form-section leave-form-section">
      <h2>📅 Request Leave</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="employeeId"
          value={leave.employeeId}
          onChange={handleChange}
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.department})
            </option>
          ))}
        </select>

        <select
          name="leaveType"
          value={leave.leaveType}
          onChange={handleChange}
        >
          <option value="">Leave Type</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Annual Leave">Annual Leave</option>
          <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
        </select>

        <div className="date-group" style={{ display: "flex", gap: "10px" }}>
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={leave.startDate}
            onChange={handleChange}
            style={{ flex: 1 }}
          />
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={leave.endDate}
            onChange={handleChange}
            style={{ flex: 1 }}
          />
        </div>

        <input
          type="text"
          name="reason"
          placeholder="Reason for Leave"
          value={leave.reason}
          onChange={handleChange}
        />

        <button className="btn" type="submit">
          Submit Leave Request
        </button>
      </form>
    </div>
  );
}

export default LeaveRequestForm;

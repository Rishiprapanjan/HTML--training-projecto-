import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

function LeaveRequestList({ leaveRequests, onUpdateStatus }) {
  return (
    <div className="employee-list leave-list-section">
      <h2>📋 Leave Requests Log</h2>

      {leaveRequests.length === 0 ? (
        <p className="no-data">No leave requests found.</p>
      ) : (
        <div className="table-responsive" style={{ overflowX: "auto", marginTop: "20px" }}>
          <table className="leave-table" style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
            <thead>
              <tr style={{ background: "#1e293b", textAlign: "left" }}>
                <th style={{ padding: "15px" }}>Employee</th>
                <th style={{ padding: "15px" }}>Type</th>
                <th style={{ padding: "15px" }}>Start Date</th>
                <th style={{ padding: "15px" }}>End Date</th>
                <th style={{ padding: "15px" }}>Reason</th>
                <th style={{ padding: "15px" }}>Status</th>
                <th style={{ padding: "15px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((req) => (
                <tr key={req.id} style={{ borderBottom: "1px solid #334155" }}>
                  <td style={{ padding: "15px" }}>{req.employeeName}</td>
                  <td style={{ padding: "15px" }}>
                    <span className="leave-type-badge">{req.leaveType}</span>
                  </td>
                  <td style={{ padding: "15px" }}>{req.startDate}</td>
                  <td style={{ padding: "15px" }}>{req.endDate}</td>
                  <td style={{ padding: "15px" }}>{req.reason}</td>
                  <td style={{ padding: "15px" }}>
                    <span className={`status-badge status-${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ padding: "15px", display: "flex", justifyContent: "center", gap: "10px" }}>
                    {req.status === "Pending" ? (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => onUpdateStatus(req.id, "Approved")}
                          title="Approve"
                          style={{
                            background: "#22c55e",
                            border: "none",
                            color: "white",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => onUpdateStatus(req.id, "Rejected")}
                          title="Reject"
                          style={{
                            background: "#ef4444",
                            border: "none",
                            color: "white",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "14px" }}>Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LeaveRequestList;

import { useState, useEffect } from "react";
import {
  getPendingTasks,
  updateTaskStatus,
  getVolunteerApps,
  updateVolunteerAppStatus,
  requestTaskDetails,
  getTasks,
} from "../store";
import { TaskRequest, VolunteerApp, ApplicationStatus } from "../types";

interface VolunteerDashboardProps {
  addToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function VolunteerDashboard({
  addToast,
}: VolunteerDashboardProps) {
  const [activeTab, setActiveTab] = useState<"proposals" | "applications">(
    "proposals",
  );
  const [proposals, setProposals] = useState<TaskRequest[]>([]);
  const [applications, setApplications] = useState<VolunteerApp[]>([]);
  const [appStatusFilter, setAppStatusFilter] = useState<
    ApplicationStatus | "all"
  >("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProposals(getPendingTasks());
    setApplications(getVolunteerApps());
  };

  const [requestTexts, setRequestTexts] = useState<Record<string, string>>({});
  const [sendingRequestId, setSendingRequestId] = useState<string | null>(null);

  const handleRequestMsgChange = (taskId: string, text: string) => {
    setRequestTexts((prev) => ({ ...prev, [taskId]: text }));
  };

  const handleSendRequest = async (taskId: string) => {
    const text = requestTexts[taskId]?.trim();
    if (!text) {
      addToast("Please enter a message to request details.", "info");
      return;
    }

    setSendingRequestId(taskId);
    try {
      await requestTaskDetails(taskId, text);
      addToast("Request sent to the user successfully!", "success");
      loadData();
      setRequestTexts((prev) => ({ ...prev, [taskId]: "" }));
    } catch (error) {
      addToast("Failed to send request.", "error");
    } finally {
      setSendingRequestId(null);
    }
  };

  const handleVerifyProposal = (id: string) => {
    updateTaskStatus(id, "verified");
    addToast("Proposal marked as verified. Sent to Admin queue.", "success");
    loadData();
  };

  const handleRejectProposal = (id: string) => {
    updateTaskStatus(id, "rejected");
    addToast("Proposal rejected.", "info");
    loadData();
  };

  const handleApproveApp = (id: string) => {
    updateVolunteerAppStatus(id, "interviewing");
    addToast("Application sent to Admin for final review.", "info");
    loadData();
  };

  const handleRejectApp = (id: string) => {
    updateVolunteerAppStatus(id, "rejected");
    addToast("Application rejected.", "error");
    loadData();
  };

  const statusLabel = (status: ApplicationStatus) => {
    if (status === "applied") return "Received";
    if (status === "interviewing") return "Sent to Admin";
    if (status === "approved") return "Accepted";
    return "Rejected";
  };

  const exportApplications = (list: VolunteerApp[], filename: string) => {
    const headers = ["Name", "Email", "Phone", "Status", "Submitted At"];
    const rows = list.map((app) => [
      app.name,
      app.email,
      app.phone,
      statusLabel(app.status),
      new Date(app.createdAt).toLocaleString("en-IN"),
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredApps =
    appStatusFilter === "all"
      ? applications
      : applications.filter((app) => app.status === appStatusFilter);

  const appCounts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {
      applied: 0,
      interviewing: 0,
      approved: 0,
      rejected: 0,
    } as Record<ApplicationStatus, number>,
  );
  const verifiedProposalsCount = getTasks().filter(
    (t) => t.status === "verified" || t.status === "approved" || t.status === "completed"
  ).length;

  const verifiedAppsCount = getVolunteerApps().filter(
    (app) => app.status === "interviewing" || app.status === "approved"
  ).length;

  return (
    <div className="page-container page-enter">
      <div className="container" style={{ padding: "40px 20px" }}>
        <h1 className="page-title" style={{ marginBottom: "8px" }}>
          Moderator <span style={{ color: "var(--primary)" }}>Dashboard</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "28px" }}>
          Screen community proposals and verify volunteer applications
        </p>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div className="card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px", border: "1px solid var(--border-light)" }}>
            <div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)" }}>
                {proposals.length}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                Pending Proposals Review
              </div>
            </div>
          </div>
          
          <div className="card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px", border: "1px solid var(--border-light)" }}>
            <div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)" }}>
                {verifiedProposalsCount}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                Proposals Verified & Sent
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px", border: "1px solid var(--border-light)" }}>
            <div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)" }}>
                {verifiedAppsCount}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                Applications Screened & Sent
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          <button
            className={`filter-chip ${activeTab === "proposals" ? "active" : ""}`}
            onClick={() => setActiveTab("proposals")}
          >
            Proposals ({proposals.length})
          </button>
          <button
            className={`filter-chip ${activeTab === "applications" ? "active" : ""}`}
            onClick={() => setActiveTab("applications")}
          >
            Volunteer Applications ({applications.length})
          </button>
        </div>

        {activeTab === "proposals" && (
          <div className="grid">
            {proposals.length === 0 ? (
              <p style={{ color: "var(--text-secondary)" }}>
                No pending proposals to review.
              </p>
            ) : (
              proposals.map((proposal) => (
                <div key={proposal.id} className="card">
                  <h3 style={{ marginBottom: "10px" }}>{proposal.title}</h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      marginBottom: "10px",
                    }}
                  >
                    By: {proposal.applicantName} ({proposal.email})
                  </p>
                  <p style={{ fontSize: "0.9rem", marginBottom: "14px" }}>
                    {proposal.description}
                  </p>

                  <div 
                    style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
                      gap: "14px", 
                      background: "rgba(0,0,0,0.02)", 
                      padding: "16px", 
                      borderRadius: "12px", 
                      marginBottom: "20px",
                      border: "1px solid var(--border-light)",
                      fontSize: "0.85rem",
                      marginTop: "14px"
                    }}
                  >
                    <div>
                      <strong style={{ color: "var(--text-secondary)" }}>Category:</strong>
                      <div style={{ textTransform: "capitalize", marginTop: "2px", fontWeight: 600 }}>
                        {proposal.category}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: "var(--text-secondary)" }}>Applicant:</strong>
                      <div style={{ textTransform: "capitalize", marginTop: "2px", fontWeight: 600 }}>
                        {proposal.applicantType === "group" ? `Group: ${proposal.organizationName || 'Organization'}` : 'Individual'}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: "var(--text-secondary)" }}>Phone Number:</strong>
                      <div style={{ marginTop: "2px", fontWeight: 600 }}>
                        {proposal.phone || "N/A"}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: "var(--text-secondary)" }}>Volunteers Requested:</strong>
                      <div style={{ marginTop: "2px", fontWeight: 600 }}>
                        {proposal.volunteersNeeded} volunteers
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: "var(--text-secondary)" }}>Event Date & Time:</strong>
                      <div style={{ marginTop: "2px", fontWeight: 600 }}>
                        {proposal.eventDate ? `${new Date(proposal.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at ${proposal.eventTime || 'Anytime'}` : "N/A"}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: "var(--text-secondary)" }}>Locality & Pincode:</strong>
                      <div style={{ marginTop: "2px", fontWeight: 600 }}>
                        {proposal.locality} {proposal.pincode ? `(${proposal.pincode})` : ''}
                      </div>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <strong style={{ color: "var(--text-secondary)" }}>Full Map Address:</strong>
                      <div style={{ marginTop: "2px", fontWeight: 500, lineHeight: "1.4" }}>
                        {proposal.address || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Moderator Request Info Section */}
                  <div style={{ marginTop: "16px", borderTop: "1px solid var(--border-light)", paddingTop: "16px", marginBottom: "16px" }}>
                    {proposal.moderatorRequest && (
                      <div style={{ background: "rgba(245, 158, 11, 0.03)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "8px", padding: "12px", marginBottom: "12px" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--warning)" }}>Extra Info Requested:</span>
                        <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                          "{proposal.moderatorRequest}"
                        </p>
                      </div>
                    )}

                    {proposal.userResponse ? (
                      <div style={{ background: "rgba(16, 185, 129, 0.03)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "8px", padding: "12px", marginBottom: "12px" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--success)" }}>User Response:</span>
                        <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "var(--text)" }}>
                          "{proposal.userResponse}"
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "8px", flexDirection: "column", alignItems: "flex-start" }}>
                        <label htmlFor={`req-${proposal.id}`} style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                          Request Additional Details:
                        </label>
                        <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                          <input
                            type="text"
                            id={`req-${proposal.id}`}
                            placeholder="e.g. Please clarify exact location or parking details..."
                            value={requestTexts[proposal.id] || ""}
                            onChange={(e) => handleRequestMsgChange(proposal.id, e.target.value)}
                            style={{ flex: 1, height: "36px", fontSize: "0.85rem", padding: "0 10px", borderRadius: "6px", border: "1px solid var(--border)" }}
                          />
                          <button
                            onClick={() => handleSendRequest(proposal.id)}
                            disabled={sendingRequestId === proposal.id}
                            className="btn btn-primary btn-sm"
                            style={{ height: "36px", whiteSpace: "nowrap" }}
                          >
                            {sendingRequestId === proposal.id ? "Sending..." : "Send Request"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleVerifyProposal(proposal.id)}
                    >
                      Verify (Send to Admin)
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{
                        color: "var(--danger)",
                        borderColor: "var(--danger)",
                      }}
                      onClick={() => handleRejectProposal(proposal.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "applications" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button
                className={`filter-chip ${appStatusFilter === "all" ? "active" : ""}`}
                onClick={() => setAppStatusFilter("all")}
              >
                All ({applications.length})
              </button>
              <button
                className={`filter-chip ${appStatusFilter === "applied" ? "active" : ""}`}
                onClick={() => setAppStatusFilter("applied")}
              >
                Received ({appCounts.applied})
              </button>
              <button
                className={`filter-chip ${appStatusFilter === "interviewing" ? "active" : ""}`}
                onClick={() => setAppStatusFilter("interviewing")}
              >
                Sent to Admin ({appCounts.interviewing})
              </button>
              <button
                className={`filter-chip ${appStatusFilter === "approved" ? "active" : ""}`}
                onClick={() => setAppStatusFilter("approved")}
              >
                Accepted ({appCounts.approved})
              </button>
              <button
                className={`filter-chip ${appStatusFilter === "rejected" ? "active" : ""}`}
                onClick={() => setAppStatusFilter("rejected")}
              >
                Rejected ({appCounts.rejected})
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() =>
                  exportApplications(
                    filteredApps,
                    "moderator-volunteer-applications.csv",
                  )
                }
                style={{ marginLeft: "auto" }}
              >
                Export CSV
              </button>
            </div>

            {filteredApps.length === 0 ? (
              <p style={{ color: "var(--text-secondary)" }}>
                No applications in this view.
              </p>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {filteredApps.map((app) => (
                  <div key={app.id} className="card" style={{ padding: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 16,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <h3 style={{ marginBottom: 6 }}>{app.name}</h3>
                        <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>
                          For Task: {app.taskTitle || "Unknown Task"}
                        </p>
                        <p
                          style={{ margin: 0, color: "var(--text-secondary)" }}
                        >
                          {app.email} · {app.phone}
                        </p>
                        <p
                          style={{
                            marginTop: 8,
                            fontSize: "0.9rem",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <strong>Reason:</strong> {app.reason}
                        </p>
                        {app.prevExperience && (
                          <p
                            style={{
                              marginTop: 8,
                              fontSize: "0.88rem",
                              color: "var(--text-secondary)",
                              background: "rgba(0,0,0,0.02)",
                              padding: "8px 12px",
                              borderRadius: "8px",
                              borderLeft: "3px solid var(--primary-light)",
                            }}
                          >
                            <strong>Previous Experience:</strong> {app.prevExperience}
                          </p>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 10,
                        }}
                      >
                        <span className={`status-badge status-${app.status}`}>
                          {statusLabel(app.status)}
                        </span>
                        {app.status === "applied" && (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleApproveApp(app.id)}
                            >
                              Send to Admin
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              style={{
                                color: "var(--danger)",
                                borderColor: "var(--danger)",
                              }}
                              onClick={() => handleRejectApp(app.id)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {app.status === "interviewing" && (
                          <button
                            className="btn btn-outline btn-sm"
                            style={{
                              color: "var(--danger)",
                              borderColor: "var(--danger)",
                            }}
                            onClick={() => handleRejectApp(app.id)}
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

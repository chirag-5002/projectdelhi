import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getTasks,
  getVerifiedTasks,
  updateTaskStatus,
  getVolunteerApps,
  updateVolunteerAppStatus,
  getSubscribers,
  getGeneralVolunteers,
  GeneralVolunteer,
  getDonationReports,
  updateDonationStatus,
  DonationReport,
} from "../store";
import {
  CATEGORY_META,
  TaskRequest,
  VolunteerApp,
  ApplicationStatus,
} from "../types";

interface Props {
  addToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function Admin({ addToast }: Props) {
  const [tab, setTab] = useState<"verified" | "all" | "volunteers" | "subscribers" | "registry" | "donations">("verified");
  const [appStatusFilter, setAppStatusFilter] = useState<
    ApplicationStatus | "all"
  >("all");
  const [, setRefresh] = useState(0);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [generalVolunteers, setGeneralVolunteers] = useState<GeneralVolunteer[]>([]);
  const [donations, setDonations] = useState<DonationReport[]>([]);

  const refresh = () => setRefresh((n) => n + 1);

  useEffect(() => {
    getSubscribers().then(setSubscribers);
    getGeneralVolunteers().then(setGeneralVolunteers);
    getDonationReports().then(setDonations);
  }, [tab]);

  const verifiedProposals = getVerifiedTasks();
  const allTasks = getTasks();
  const volunteerApps = getVolunteerApps();

  const handlePublish = (id: string) => {
    updateTaskStatus(id, "approved");
    addToast("Task approved and now Live!", "success");
    refresh();
  };

  const handleReject = (id: string) => {
    updateTaskStatus(id, "rejected");
    addToast("Task rejected", "info");
    refresh();
  };

  const handleApproveApp = (id: string) => {
    updateVolunteerAppStatus(id, "approved");
    addToast("Volunteer application approved", "success");
    refresh();
  };

  const handleRejectApp = (id: string) => {
    updateVolunteerAppStatus(id, "rejected");
    addToast("Volunteer application rejected", "info");
    refresh();
  };

  const handleApproveDonation = async (id: string) => {
    const res = await updateDonationStatus(id, "approved");
    if (res.success) {
      addToast("Donation approved! Tax receipt email triggered.", "success");
      getDonationReports().then(setDonations);
    } else {
      addToast(res.message || "Failed to approve donation", "error");
    }
  };

  const handleRejectDonation = async (id: string) => {
    const res = await updateDonationStatus(id, "rejected");
    if (res.success) {
      addToast("Donation report rejected.", "info");
      getDonationReports().then(setDonations);
    } else {
      addToast(res.message || "Failed to reject donation", "error");
    }
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
      ? volunteerApps
      : volunteerApps.filter((app) => app.status === appStatusFilter);

  const appCounts = volunteerApps.reduce(
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

  const displayTasks = tab === "verified" ? verifiedProposals : allTasks;

  return (
    <div className="container page-section page-enter">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div>
          <h2 style={{ fontWeight: 800 }}>Admin Dashboard</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Manage final task publishing and verification
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 32,
        }}
      >
        <div
          className="card card-flat"
          style={{ padding: 20, textAlign: "center" }}
        >
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "var(--warning)",
            }}
          >
            {verifiedProposals.length}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Ready for Live
          </div>
        </div>
        <div
          className="card card-flat"
          style={{ padding: 20, textAlign: "center" }}
        >
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "var(--success)",
            }}
          >
            {allTasks.filter((t) => t.status === "approved").length}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Live Proposals
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button
          className={`filter-chip ${tab === "verified" ? "active" : ""}`}
          onClick={() => setTab("verified")}
        >
          Verified Proposals ({verifiedProposals.length})
        </button>
        <button
          className={`filter-chip ${tab === "all" ? "active" : ""}`}
          onClick={() => setTab("all")}
        >
          All Tasks
        </button>
        <button
          className={`filter-chip ${tab === "volunteers" ? "active" : ""}`}
          onClick={() => setTab("volunteers")}
        >
          Volunteer Applications ({volunteerApps.length})
        </button>
        <button
          className={`filter-chip ${tab === "subscribers" ? "active" : ""}`}
          onClick={() => setTab("subscribers")}
        >
          Email Subscribers ({subscribers.length})
        </button>
        <button
          className={`filter-chip ${tab === "registry" ? "active" : ""}`}
          onClick={() => setTab("registry")}
        >
          General Registry ({generalVolunteers.length})
        </button>
        <button
          className={`filter-chip ${tab === "donations" ? "active" : ""}`}
          onClick={() => setTab("donations")}
        >
          Donation Reports ({donations.length})
        </button>
      </div>

      {/* Task List */}
      {(tab === "verified" || tab === "all") && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {displayTasks.length === 0 ? (
            <div className="empty-state">
              <h3>No {tab} tasks</h3>
              <p>All caught up! No tasks to review right now.</p>
            </div>
          ) : (
            displayTasks.map((task: TaskRequest) => {
              const cat = CATEGORY_META[task.category];
              return (
                <div key={task.id} className="card admin-card">
                  <div className="admin-task-header">
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                          marginBottom: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          className="tag"
                          style={{
                            background: cat.color + "15",
                            color: cat.color,
                          }}
                        >
                          {cat.emoji} {cat.label}
                        </span>
                        <span className={`status-badge status-${task.status}`}>
                          {task.status.toUpperCase()}
                        </span>
                        <span
                          className="tag"
                          style={{ background: "var(--bg-warm)", color: "var(--text-secondary)" }}
                        >
                          {task.applicantType === "group"
                            ? "Organization"
                            : "Individual"}
                        </span>
                      </div>
                      <h3>
                        <Link
                          to={`/task/${task.id}`}
                          style={{
                            color: "var(--text)",
                            textDecoration: "none",
                          }}
                        >
                          {task.title}
                        </Link>
                      </h3>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-secondary)",
                          marginTop: 6,
                          lineHeight: 1.6,
                        }}
                      >
                        {task.description.substring(0, 200)}
                        {task.description.length > 200 ? "..." : ""}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          marginTop: 10,
                          fontSize: "0.85rem",
                          color: "var(--text-muted)",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>
                          👤 {task.applicantName}
                          {task.organizationName
                            ? ` — ${task.organizationName}`
                            : ""}
                        </span>
                        <span>
                          📍 {task.locality}, {task.city}
                        </span>
                        <span>
                          📅{" "}
                          {new Date(task.eventDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span>
                          {task.volunteers.length}/{task.volunteersNeeded}{" "}
                          volunteers
                        </span>
                      </div>

                      <div 
                        style={{ 
                          display: "grid", 
                          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                          gap: "10px", 
                          background: "rgba(0,0,0,0.02)", 
                          padding: "12px", 
                          borderRadius: "10px", 
                          marginTop: "12px",
                          border: "1px solid var(--border-light)",
                          fontSize: "0.8rem"
                        }}
                      >
                        <div>
                          <strong style={{ color: "var(--text-secondary)" }}>Email:</strong> {task.email || "N/A"}
                        </div>
                        <div>
                          <strong style={{ color: "var(--text-secondary)" }}>Phone:</strong> {task.phone || "N/A"}
                        </div>
                        <div>
                          <strong style={{ color: "var(--text-secondary)" }}>Time:</strong> {task.eventTime || "Anytime"}
                        </div>
                        <div>
                          <strong style={{ color: "var(--text-secondary)" }}>Pincode:</strong> {task.pincode || "N/A"}
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <strong style={{ color: "var(--text-secondary)" }}>Full Map Address:</strong> {task.address || "N/A"}
                        </div>
                      </div>
                    </div>
                    {task.status === "verified" && (
                      <div className="admin-actions" style={{ flexShrink: 0 }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handlePublish(task.id)}
                        >
                          Publish (Live)
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(task.id)}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "volunteers" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button
              className={`filter-chip ${appStatusFilter === "all" ? "active" : ""}`}
              onClick={() => setAppStatusFilter("all")}
            >
              All ({volunteerApps.length})
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
                  "admin-volunteer-applications.csv",
                )
              }
              style={{ marginLeft: "auto" }}
            >
              Export CSV
            </button>
          </div>

          {filteredApps.length === 0 ? (
            <div className="empty-state">
              <h3>No applications</h3>
              <p>No volunteer applications in this view.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                      <p style={{ margin: 0, color: "var(--text-secondary)" }}>
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
                      {app.status === "interviewing" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApproveApp(app.id)}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRejectApp(app.id)}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {app.status === "applied" && (
                        <button
                          className="btn btn-danger btn-sm"
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

      {tab === "subscribers" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Newsletter Subscribers</h3>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                const headers = ["Email"];
                const rows = subscribers.map((email) => [email]);
                const csv = [headers, ...rows]
                  .map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
                  .join("\n");
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "newsletter-subscribers.csv";
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </button>
          </div>

          {subscribers.length === 0 ? (
            <div className="empty-state">
              <h3>No subscribers</h3>
              <p>No email subscribers found yet.</p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--border-light)" }}>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>
                      Email Address
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((email, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "12px 16px", fontSize: "0.95rem" }}>{email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "registry" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>General Volunteer Registry</h3>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                const headers = ["Name", "Email", "Phone", "Preferred Role", "Location", "Registered At"];
                const rows = generalVolunteers.map((vol) => [
                  vol.name,
                  vol.email,
                  vol.phone,
                  vol.preferredRole,
                  vol.location,
                  new Date(vol.createdAt).toLocaleString("en-IN"),
                ]);
                const csv = [headers, ...rows]
                  .map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
                  .join("\n");
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "general-volunteer-registry.csv";
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </button>
          </div>

          {generalVolunteers.length === 0 ? (
            <div className="empty-state">
              <h3>No volunteers registered</h3>
              <p>No general volunteers found in the registry yet.</p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: "hidden", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "600px" }}>
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--border-light)" }}>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>Name</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>Email</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>Phone</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>Preferred Role</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>Location</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>Registered At</th>
                  </tr>
                </thead>
                <tbody>
                  {generalVolunteers.map((vol, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "12px 16px", fontSize: "0.95rem", fontWeight: 600 }}>{vol.name}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.95rem" }}>{vol.email}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.95rem" }}>{vol.phone}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.95rem" }}>{vol.preferredRole}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.95rem" }}>{vol.location}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.95rem", color: "var(--text-muted)" }}>
                        {new Date(vol.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "donations" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Donation Reports</h3>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                const headers = ["Date", "Donor Name", "Email", "Phone", "Amount", "Method", "Transaction ID", "Status"];
                const rows = donations.map((d) => [
                  new Date(d.createdAt).toLocaleString("en-IN"),
                  d.name,
                  d.email,
                  d.phone,
                  d.amount,
                  d.method.toUpperCase(),
                  d.transactionId,
                  d.status.toUpperCase(),
                ]);
                const csv = [headers, ...rows]
                  .map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
                  .join("\n");
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "donation-reports-registry.csv";
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </button>
          </div>

          {donations.length === 0 ? (
            <div className="empty-state">
              <h3>No donation reports</h3>
              <p>No manual donation reports have been submitted yet.</p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: "hidden", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "850px" }}>
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--border-light)" }}>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>Date</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>Donor Name</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>Email & Phone</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>Amount (INR)</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>Method</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>Transaction ID</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>Status</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)", background: d.status === "pending" ? "rgba(140,36,36,0.015)" : "inherit" }}>
                      <td style={{ padding: "12px 16px", fontSize: "0.9rem" }}>
                        {new Date(d.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "0.95rem", fontWeight: 600 }}>{d.name}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.9rem" }}>
                        <div>{d.email}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "2px" }}>{d.phone}</div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "0.95rem", fontWeight: 700, color: "var(--primary)" }}>₹{d.amount}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.85rem" }}>
                        <span style={{ textTransform: "uppercase", fontWeight: 600, background: "var(--bg)", padding: "2px 6px", borderRadius: "4px", border: "1px solid var(--border)" }}>
                          {d.method}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "0.9rem", fontFamily: "monospace" }}>{d.transactionId}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.9rem" }}>
                        <span className={`status-badge status-${d.status}`} style={{ textTransform: "uppercase" }}>
                          {d.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        {d.status === "pending" ? (
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <button
                              className="btn btn-primary btn-xs"
                              onClick={() => handleApproveDonation(d.id)}
                              style={{ background: "#2e7d32", borderColor: "#2e7d32", padding: "4px 8px", fontSize: "0.75rem", color: "white" }}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-outline btn-xs"
                              onClick={() => handleRejectDonation(d.id)}
                              style={{ color: "#c62828", borderColor: "#c62828", padding: "4px 8px", fontSize: "0.75rem", background: "none" }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            Verified
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

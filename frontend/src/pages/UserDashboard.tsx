import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTasks, getCurrentUser, respondToTaskRequest, initStore, getVolunteerApps, getTaskById } from "../store";
import { TaskRequest, CATEGORY_META, VolunteerApp } from "../types";
import { Send, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";

interface Props {
  addToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function UserDashboard({ addToast }: Props) {
  const [activeTab, setActiveTab] = useState<"proposals" | "volunteering">("proposals");
  const [myProposals, setMyProposals] = useState<TaskRequest[]>([]);
  const [myApplications, setMyApplications] = useState<VolunteerApp[]>([]);
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  
  const currentUser = getCurrentUser();

  const loadDashboardData = () => {
    if (!currentUser) return;
    const allTasks = getTasks();
    const userTasks = allTasks.filter(
      (task) => task.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
    );
    setMyProposals(userTasks);

    const allApps = getVolunteerApps();
    const userApps = allApps.filter(
      (app) => app.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
    );
    setMyApplications(userApps);
  };

  useEffect(() => {
    initStore().then(loadDashboardData);
  }, []);

  const handleResponseChange = (taskId: string, text: string) => {
    setResponseTexts((prev) => ({ ...prev, [taskId]: text }));
  };

  const handleSubmitResponse = async (taskId: string) => {
    const text = responseTexts[taskId]?.trim();
    if (!text) {
      addToast("Please enter some details before submitting.", "error");
      return;
    }

    setSubmittingId(taskId);
    try {
      await respondToTaskRequest(taskId, text);
      addToast("Information submitted successfully!", "success");
      loadDashboardData();
    } catch (error) {
      addToast("Failed to submit information.", "error");
    } finally {
      setSubmittingId(null);
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="tag" style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--warning)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Clock size={14} /> Pending Screening
          </span>
        );
      case "verified":
        return (
          <span className="tag" style={{ background: "rgba(99, 102, 241, 0.1)", color: "var(--primary-light)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Clock size={14} /> Verified (In Review)
          </span>
        );
      case "approved":
        return (
          <span className="tag" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--success)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle size={14} /> Approved & Live
          </span>
        );
      case "rejected":
        return (
          <span className="tag" style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <XCircle size={14} /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const renderAppStatus = (status: string) => {
    switch (status) {
      case "applied":
        return (
          <span className="tag" style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--warning)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Clock size={14} /> Received
          </span>
        );
      case "interviewing":
        return (
          <span className="tag" style={{ background: "rgba(99, 102, 241, 0.1)", color: "var(--primary-light)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Clock size={14} /> Sent to Admin
          </span>
        );
      case "approved":
        return (
          <span className="tag" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--success)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle size={14} /> Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="tag" style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <XCircle size={14} /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (!currentUser) {
    return (
      <div className="container page-section" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h3>Access Denied</h3>
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="page-container page-enter">
      <div className="container" style={{ padding: "40px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: 0 }}>
              My <span style={{ color: "var(--primary)" }}>Dashboard</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "4px" }}>
              Track your raised proposals and view your volunteer requests
            </p>
          </div>
          <button 
            onClick={() => {
              initStore().then(() => {
                loadDashboardData();
                addToast("Dashboard refreshed", "info");
              });
            }} 
            className="btn btn-outline btn-sm"
          >
            Refresh
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          <button
            className={`filter-chip ${activeTab === "proposals" ? "active" : ""}`}
            onClick={() => setActiveTab("proposals")}
          >
            My Proposals ({myProposals.length})
          </button>
          <button
            className={`filter-chip ${activeTab === "volunteering" ? "active" : ""}`}
            onClick={() => setActiveTab("volunteering")}
          >
            Volunteer Requests ({myApplications.length})
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {activeTab === "proposals" ? (
            myProposals.length === 0 ? (
              <div className="card" style={{ padding: "48px 20px", textAlign: "center", border: "1px dashed var(--border)" }}>
                <h3 style={{ marginBottom: "8px" }}>No Proposals Raised Yet</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.92rem" }}>
                  Got an idea to make Delhi better? Submit an initiative today!
                </p>
                <Link to="/submit" className="btn btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
                  Raise a Proposal
                </Link>
              </div>
            ) : (
              myProposals.map((proposal) => {
                const cat = CATEGORY_META[proposal.category];
                const hasRequest = !!proposal.moderatorRequest;
                const hasResponse = !!proposal.userResponse;

                return (
                  <div key={proposal.id} className="card" style={{ padding: "28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                      <div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "8px" }}>
                          <span className="tag" style={{ background: cat.color + "15", color: cat.color }}>
                            {cat.emoji} {cat.label}
                          </span>
                          {renderStatus(proposal.status)}
                        </div>
                        <h3 style={{ color: "var(--text)", fontWeight: 700, margin: 0 }}>{proposal.title}</h3>
                      </div>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        Raised on: {new Date(proposal.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "20px" }}>
                      {proposal.description}
                    </p>

                    <div 
                      style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                        gap: "10px", 
                        background: "rgba(0,0,0,0.01)", 
                        padding: "12px", 
                        borderRadius: "10px", 
                        marginBottom: "20px",
                        border: "1px solid var(--border-light)",
                        fontSize: "0.8rem"
                      }}
                    >
                      <div>
                        <strong style={{ color: "var(--text-secondary)" }}>Locality:</strong> {proposal.locality} ({proposal.pincode})
                      </div>
                      <div>
                        <strong style={{ color: "var(--text-secondary)" }}>Date & Time:</strong> {proposal.eventDate} at {proposal.eventTime}
                      </div>
                      <div>
                        <strong style={{ color: "var(--text-secondary)" }}>Volunteers:</strong> {proposal.volunteersNeeded} requested
                      </div>
                    </div>

                    {/* Moderator Request Box */}
                    {hasRequest && (
                      <div 
                        style={{ 
                          border: "1px solid rgba(245, 158, 11, 0.2)", 
                          background: "rgba(245, 158, 11, 0.03)", 
                          borderRadius: "16px", 
                          padding: "20px",
                          marginTop: "16px"
                        }}
                      >
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "var(--warning)", fontWeight: 700, fontSize: "0.9rem", marginBottom: "8px" }}>
                          <AlertCircle size={16} /> Action Required: Moderator Requesting Details
                        </div>
                        <p style={{ fontSize: "0.9rem", color: "var(--text)", fontStyle: "italic", background: "white", padding: "12px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.04)" }}>
                          "{proposal.moderatorRequest}"
                        </p>

                        {hasResponse ? (
                          <div style={{ marginTop: "16px", borderTop: "1px solid rgba(245, 158, 11, 0.1)", paddingTop: "16px" }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--success)" }}>Your Submitted Information:</span>
                            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "6px", background: "rgba(16, 185, 129, 0.03)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
                              {proposal.userResponse}
                            </p>
                          </div>
                        ) : (
                          <div style={{ marginTop: "16px" }}>
                            <label htmlFor={`res-${proposal.id}`} style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                              Your Response:
                            </label>
                            <textarea
                              id={`res-${proposal.id}`}
                              rows={3}
                              placeholder="Provide the requested details here..."
                              value={responseTexts[proposal.id] || ""}
                              onChange={(e) => handleResponseChange(proposal.id, e.target.value)}
                              style={{ 
                                width: "100%", 
                                borderRadius: "8px", 
                                border: "1px solid var(--border)", 
                                padding: "10px", 
                                fontSize: "0.9rem", 
                                fontFamily: "inherit",
                                marginBottom: "12px",
                                resize: "vertical"
                              }}
                            />
                            <button
                              onClick={() => handleSubmitResponse(proposal.id)}
                              disabled={submittingId === proposal.id}
                              className="btn btn-primary btn-sm"
                              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                            >
                              <Send size={14} /> {submittingId === proposal.id ? "Submitting..." : "Submit Information"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )
          ) : (
            myApplications.length === 0 ? (
              <div className="card" style={{ padding: "48px 20px", textAlign: "center", border: "1px dashed var(--border)" }}>
                <h3 style={{ marginBottom: "8px" }}>No Volunteering Requests Yet</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.92rem" }}>
                  Join active community drives and make a direct impact!
                </p>
                <Link to="/browse" className="btn btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
                  Browse Events
                </Link>
              </div>
            ) : (
              myApplications.map((app) => {
                const task = getTaskById(app.taskId);
                const cat = task ? CATEGORY_META[task.category] : null;

                return (
                  <div key={app.id} className="card" style={{ padding: "28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                      <div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "8px" }}>
                          {cat && (
                            <span className="tag" style={{ background: cat.color + "15", color: cat.color }}>
                              {cat.emoji} {cat.label}
                            </span>
                          )}
                          {renderAppStatus(app.status)}
                        </div>
                        <h3 style={{ color: "var(--text)", fontWeight: 700, margin: 0 }}>
                          {task ? (
                            <Link to={`/task/${task.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                              {app.taskTitle}
                            </Link>
                          ) : (
                            app.taskTitle
                          )}
                        </h3>
                      </div>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        Applied on: {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    {task && (
                      <div 
                        style={{ 
                          display: "grid", 
                          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                          gap: "10px", 
                          background: "rgba(0,0,0,0.01)", 
                          padding: "12px", 
                          borderRadius: "10px", 
                          marginBottom: "16px",
                          border: "1px solid var(--border-light)",
                          fontSize: "0.8rem"
                        }}
                      >
                        <div>
                          <strong style={{ color: "var(--text-secondary)" }}>Locality:</strong> {task.locality} ({task.pincode})
                        </div>
                        <div>
                          <strong style={{ color: "var(--text-secondary)" }}>Date & Time:</strong> {task.eventDate} at {task.eventTime}
                        </div>
                      </div>
                    )}

                    <div style={{ background: "var(--bg-warm)", padding: "16px", borderRadius: "12px", fontSize: "0.9rem", border: "1px solid var(--border-light)" }}>
                      <div style={{ marginBottom: "8px" }}>
                        <strong style={{ color: "var(--text-secondary)", fontSize: "0.82rem", display: "block" }}>Contact Submitted:</strong>
                        <span>Phone: {app.phone}</span>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong style={{ color: "var(--text-secondary)", fontSize: "0.82rem", display: "block" }}>Reason / Message:</strong>
                        <span style={{ fontStyle: "italic" }}>"{app.reason}"</span>
                      </div>
                      {app.prevExperience && (
                        <div>
                          <strong style={{ color: "var(--text-secondary)", fontSize: "0.82rem", display: "block" }}>Previous Volunteering Experience:</strong>
                          <span>{app.prevExperience}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>
    </div>
  );
}

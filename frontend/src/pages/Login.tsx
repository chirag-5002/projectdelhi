import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { loginWithEmailPassword, loginWithGoogle } from "../store";
import { LogoFull } from "../components/Logo";
import { GoogleLogin } from "@react-oauth/google";


interface Props {
  addToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function Login({ addToast }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await loginWithEmailPassword(email, password);
      addToast(`Successfully logged in as ${user.role}!`, "success");

      if (redirectTo) {
        navigate(redirectTo);
      } else if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "MODERATOR") {
        navigate("/volunteer-dashboard");
      } else {
        navigate("/browse");
      }
    } catch (err: any) {
      addToast(err.message || "Failed to log in", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 84px)",
        background: "var(--bg-warm)",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          maxWidth: "1040px",
          width: "100%",
          background: "var(--bg-card)",
          borderRadius: "32px",
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
          minHeight: "600px",
          border: "1px solid var(--border-light)",
        }}
      >
        {/* Left Side - Image Section (Floating look with padding) */}
        <div
          style={{
            flex: "1",
            position: "relative",
            padding: "20px",
            display: "flex",
          }}
          className="login-video-side"
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "24px",
              overflow: "hidden",
            }}
          >
            <img
              src="/login-bg.jpg"
              alt="Projectdelhi Initiative"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 30,
                left: 30,
                right: 30,
                color: "white",
                zIndex: 2,
              }}
            >
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  marginBottom: 10,
                  lineHeight: 1.1,
                }}
              >
                Join the <br />
                Movement.
              </h1>
              <p
                style={{
                  fontSize: "0.95rem",
                  opacity: 0.9,
                  maxWidth: 360,
                  lineHeight: 1.5,
                }}
              >
                Access your dashboard to propose new initiatives and track
                community impact across Delhi.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div
          style={{
            flex: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px",
          }}
        >
          <div style={{ maxWidth: "380px", width: "100%" }}>
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <h2
                style={{
                  fontSize: "1.7rem",
                  fontWeight: 800,
                  marginBottom: 8,
                  color: "var(--text)",
                }}
              >
                Sign In
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
                Enter your credentials to continue
              </p>
            </div>


            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label
                  htmlFor="email"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  style={{
                    height: "48px",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                  }}
                />
              </div>

              <div className="form-group" style={{ marginTop: 20 }}>
                <label
                  htmlFor="password"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    height: "48px",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                  }}
                />
              </div>

              <div
                style={{ textAlign: "right", marginTop: 12, marginBottom: 28 }}
              >
                <span
                  style={{
                    color: "var(--primary)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Forgot password?
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  height: "52px",
                  borderRadius: "10px",
                  fontSize: "1rem",
                }}
                disabled={loading}
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    Sign In <ArrowRight size={18} />
                  </span>
                )}
              </button>
            </form>

            <div style={{ margin: "24px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }}></div>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }}></div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", width: "100%" }} className="google-btn-container">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    try {
                      setLoading(true);
                      const user = await loginWithGoogle(credentialResponse.credential);
                      addToast(`Successfully logged in as ${user.role}!`, "success");
                      if (redirectTo) {
                        navigate(redirectTo);
                      } else if (user.role === "ADMIN") {
                        navigate("/admin");
                      } else if (user.role === "MODERATOR") {
                        navigate("/volunteer-dashboard");
                      } else {
                        navigate("/browse");
                      }
                    } catch (err: any) {
                      addToast(err.message || "Failed to log in with Google", "error");
                    } finally {
                      setLoading(false);
                    }
                  }
                }}
                onError={() => {
                  addToast("Google Authentication Failed", "error");
                }}
                theme="filled_blue"
                shape="pill"
                size="large"
                width="380"
              />
            </div>


            <p
              style={{
                textAlign: "center",
                marginTop: 28,
                fontSize: "0.92rem",
                color: "var(--text-secondary)",
              }}
            >
              Don't have an account? <br />{" "}
              <Link
                to="/signup"
                style={{
                  color: "var(--primary)",
                  fontWeight: 700,
                  cursor: "pointer",
                  marginTop: 8,
                  display: "inline-block",
                  textDecoration: "none",
                }}
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .login-video-side { display: flex; }
        @media (max-width: 900px) {
          .login-video-side { display: none !important; }
        }
      `}</style>
    </div>
  );
}

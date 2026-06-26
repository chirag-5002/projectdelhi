export default function Terms() {
  const sections = [
    { id: "intro", title: "Introduction" },
    { id: "acceptance", title: "1. Acceptance of Terms & Eligibility" },
    { id: "uses", title: "2. Permitted and Prohibited Uses" },
    { id: "accounts", title: "3. User Accounts & Registrations" },
    { id: "donations", title: "4. Donations and Payments" },
    { id: "intellectual", title: "5. Intellectual Property Rights" },
    { id: "usercontent", title: "6. User-Generated Content" },
    { id: "thirdparty", title: "7. Third-Party Links & Services" },
    { id: "disclaimers", title: "8. Disclaimers" },
    { id: "liability", title: "9. Limitation of Liability" },
    { id: "termination", title: "10. Termination" },
    { id: "governing", title: "11. Governing Law & Dispute Resolution" },
    { id: "forcemajeure", title: "12. Force Majeure" },
    { id: "contact", title: "13. Contact Information" },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const absoluteY = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: absoluteY - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container page-section page-enter">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Block */}
        <div style={{ marginBottom: "48px", textAlign: "left" }}>
          <h2 style={{ fontSize: "2.8rem", fontWeight: 800, marginBottom: "16px", color: "var(--text)" }}>
            Terms & Conditions
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Last updated: June 26, 2026
          </p>
        </div>

        {/* Layout: Split Grid */}
        <div className="legal-layout">
          {/* Sidebar (Sticky Table of Contents) */}
          <aside className="legal-sidebar">
            <h4>Table of Contents</h4>
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className="legal-sidebar-link"
              >
                {sec.title}
              </button>
            ))}
          </aside>

          {/* Right Column: Actual Terms Content */}
          <div className="legal-content-card">
            <section id="intro">
              <p>
                These Terms and Conditions of Website Use (“Terms”) govern your access to and use of the websites operated by Naksh Foundation (“Naksh Foundation”, “we”, “us”, “our”), a Delhi-based non-profit promoting cyber safety and awareness through Project CyberShield. The Sites include:
              </p>
              <ul style={{ marginTop: "8px" }}>
                <li>naksh.org</li>
                <li>nakshfoundation.org</li>
                <li>projectdelhi.org</li>
                <li>projectcybershield.in</li>
                <li>projectcybershield.org</li>
                <li>(including all subdomains and pages)</li>
              </ul>
              <p style={{ marginTop: "16px" }}>
                This document sets clear rules for using Naksh Foundation sites, allowing educational access and event registrations while prohibiting misuse like hacking or spam. It protects our copyrighted content, limits liability for non-profit operations, and specifies Indian law with Delhi courts for any disputes, ensuring safe delivery of Project CyberShield initiatives.
              </p>
              <p style={{ marginTop: "16px", fontWeight: 600 }}>
                By accessing or using the Sites, you (“you”, “user”) agree to be bound by these Terms, our Privacy Policy, and all applicable laws. If you do not agree, you must not use the Sites. We may update these Terms at any time; your continued use after changes constitutes acceptance. It is your responsibility to check for updates.
              </p>
            </section>

            <section id="acceptance">
              <h3>1. Acceptance of Terms and Eligibility</h3>
              <ul>
                <li>Your use of the Sites constitutes your full acceptance of these Terms, the Privacy Policy, and any supplemental guidelines (e.g., event-specific rules).</li>
                <li>Use is permitted only for lawful purposes consistent with our non-profit mission. Commercial use requires prior written approval from Naksh Foundation.</li>
              </ul>
            </section>

            <section id="uses">
              <h3>2. Permitted and Prohibited Uses</h3>
              <p style={{ fontWeight: 600, marginBottom: "8px" }}>Permitted Uses:</p>
              <ul>
                <li>Viewing and downloading educational content on cyber safety, digital literacy, phishing prevention, ransomware awareness, and related topics for personal or classroom use.</li>
                <li>Registering for free or paid webinars, workshops, quizzes, hackathons, competitions, or awareness programs.</li>
                <li>Submitting inquiries, volunteer applications, partnership proposals, feedback forms, or making donations.</li>
                <li>Printing limited copies (up to 10% of any material) for non-commercial educational purposes, with proper attribution.</li>
              </ul>
              <p style={{ fontWeight: 600, marginTop: "20px", marginBottom: "8px" }}>Prohibited Uses:</p>
              <ul>
                <li>Any illegal activity, including cybercrimes under the Information Technology Act, 2000 (e.g., hacking, phishing, identity theft simulations without authorization).</li>
                <li>Technical interference: unauthorized access, brute-force attacks, DDoS, viruses/malware, bots, web scrapers, or excessive automated requests.</li>
                <li>Intellectual property violations: copying, reproducing, distributing, modifying, translating, or commercially exploiting content without permission.</li>
                <li>Harmful conduct: harassment, defamation, impersonation, hate speech, misinformation, or spamming.</li>
                <li>Data harvesting: collecting personal information (e.g., emails, names) from the Sites without explicit consent.</li>
                <li>Misleading practices: framing pages, deep linking without permission, or implying endorsement/affiliation.</li>
                <li>Overloading servers or disrupting service to other users.</li>
              </ul>
              <p style={{ marginTop: "16px", fontStyle: "italic" }}>
                Violations may result in immediate account suspension, IP blocking, content removal, and legal action (including under IT Act Sections 43, 65, 66, and 66A-F).
              </p>
            </section>

            <section id="accounts">
              <h3>3. User Accounts and Registrations</h3>
              <p>To access certain features (e.g., event registration, course dashboards), you may need to create an account or complete a registration form. You agree to:</p>
              <ul>
                <li>Provide accurate, current, and complete information.</li>
                <li>Update your information promptly.</li>
                <li>Maintain confidentiality of login credentials and notify us immediately of any unauthorized use.</li>
              </ul>
              <p style={{ marginTop: "16px" }}>
                You are responsible for all activities under your account. We reserve the right to monitor usage.
                We may suspend, terminate, or delete accounts at our discretion for violations, inactivity (after 12 months), or security reasons, without notice or liability. No refunds are available for any prepaid services.
                Event registrations are non-transferable and subject to availability. Cancellations follow event-specific policies; donations are non-refundable except as required by law.
              </p>
            </section>

            <section id="donations">
              <h3>4. Donations, Payments, and Contributions</h3>
              <ul>
                <li>Donations are voluntary, irrevocable, and support our cyber awareness mission. They qualify for 80G tax deductions where applicable.</li>
                <li>Payments are processed exclusively through secure third-party gateways (e.g., Razorpay, PayU). We do not store full payment card details.</li>
                <li>You represent that donations originate from legitimate sources and comply with FCRA, Income Tax Act, and anti-money laundering regulations.</li>
                <li>Receipts are issued electronically. We are not liable for payment processing errors by gateways.</li>
              </ul>
            </section>

            <section id="intellectual">
              <h3>5. Intellectual Property Rights</h3>
              <p>
                All content on the Sites including text, graphics, logos, videos, infographics, toolkits, course materials, and software (“Content”) is owned by Naksh Foundation or our licensors and protected by the Copyright Act, 1957, Trademarks Act, 1999, and international laws.
              </p>
              <p style={{ marginTop: "16px" }}>
                <strong>Limited License:</strong> You receive a non-exclusive, non-transferable, revocable license for personal, non-commercial use. Educational institutions may use content for teaching with attribution.
              </p>

              <div style={{ overflowX: "auto", marginTop: "20px", marginBottom: "20px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-light)", background: "rgba(0,0,0,0.02)" }}>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: 700 }}>Use Case</th>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: 700 }}>Permitted</th>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: 700 }}>Requirements</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "12px" }}>Personal viewing / download</td>
                      <td style={{ padding: "12px", color: "#10b981", fontWeight: 600 }}>Yes</td>
                      <td style={{ padding: "12px" }}>Non-commercial only</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "12px" }}>Classroom sharing</td>
                      <td style={{ padding: "12px", color: "#10b981", fontWeight: 600 }}>Yes</td>
                      <td style={{ padding: "12px" }}>© Naksh Foundation</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "12px" }}>Website embedding</td>
                      <td style={{ padding: "12px", color: "#f59e0b", fontWeight: 600 }}>Case-by-case</td>
                      <td style={{ padding: "12px" }}>Email hello@naksh.org for approval</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "12px" }}>Commercial / training use</td>
                      <td style={{ padding: "12px", color: "#ef4444", fontWeight: 600 }}>No</td>
                      <td style={{ padding: "12px" }}>Written license required</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "12px" }}>Mass redistribution</td>
                      <td style={{ padding: "12px", color: "#ef4444", fontWeight: 600 }}>No</td>
                      <td style={{ padding: "12px" }}>Prohibited</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p style={{ marginTop: "16px" }}>
                No implied rights are granted. To request permissions, contact <a href="mailto:hello@naksh.org" style={{ color: "var(--primary)" }}>hello@naksh.org</a>.
                Infringement notices under the IT Act / DMCA should be sent to <a href="mailto:hello@naksh.org" style={{ color: "var(--primary)" }}>hello@naksh.org</a> with details of the claimed violation.
              </p>
            </section>

            <section id="usercontent">
              <h3>6. User-Generated Content</h3>
              <ul>
                <li>Feedback, comments, suggestions, or uploads (“User Content”) submitted via forms, emails, or forums grant Naksh Foundation a perpetual, irrevocable, worldwide, royalty-free license to use, modify, reproduce, distribute, and publicize it for our mission.</li>
                <li>You warrant User Content is lawful, original, and non-infringing. No viruses or harmful code are permitted.</li>
                <li>We may review, edit, or remove User Content at our discretion. We are not liable for User Content.</li>
              </ul>
            </section>

            <section id="thirdparty">
              <h3>7. Third-Party Links and Services</h3>
              <ul>
                <li>The Sites may link to or integrate third-party services (e.g., Zoom for webinars, YouTube for videos, Google Forms for registrations, payment gateways).</li>
                <li>These are provided for convenience; we do not endorse, control, or assume responsibility for them. Review their terms and privacy policies.</li>
                <li>No deep linking, framing, or inline linking is permitted without prior permission.</li>
              </ul>
            </section>

            <section id="disclaimers">
              <h3>8. Disclaimers</h3>
              <ul>
                <li><strong>AS IS / AS AVAILABLE:</strong> The Sites and Content are provided without warranties of any kind, express or implied, including merchantability, fitness for purpose, accuracy, or non-infringement.</li>
                <li>Educational materials are for general awareness only—not professional cybersecurity advice, legal guidance, or guarantees against threats. Consult CERT-In, lawyers, or cyber experts for specific issues.</li>
                <li>We disclaim liability for reliance on Content or interruptions due to maintenance, cyberattacks, or force majeure.</li>
              </ul>
            </section>

            <section id="liability">
              <h3>9. Limitation of Liability</h3>
              <p>To the fullest extent under Indian law (including Section 79 of the IT Act):</p>
              <ul>
                <li>No liability is assumed for indirect, incidental, special, consequential, or punitive damages (e.g., data loss, lost profits).</li>
                <li>Direct damages are capped at INR 1,000 (One Thousand) per claim/incident.</li>
                <li>Not liable for user or third-party actions, including during events or volunteer activities.</li>
              </ul>
            </section>

            <section id="termination">
              <h3>10. Termination</h3>
              <ul>
                <li>We may terminate or suspend your access immediately, without notice or liability, for any violation.</li>
                <li>Upon termination, your license ends; IP and liability clauses survive.</li>
              </ul>
            </section>

            <section id="governing">
              <h3>11. Governing Law and Dispute Resolution</h3>
              <ul>
                <li>Governed by the laws of India, excluding conflict of laws.</li>
                <li>Exclusive jurisdiction: Courts in Delhi, India.</li>
                <li>Pre-dispute resolution: Good-faith negotiation via <a href="mailto:hello@naksh.org" style={{ color: "var(--primary)" }}>hello@naksh.org</a> (30 days).</li>
                <li>No class actions or jury trials are permitted.</li>
              </ul>
            </section>

            <section id="forcemajeure">
              <h3>12. Force Majeure</h3>
              <p>
                No liability for delays or failures beyond reasonable control (e.g., cyberattacks, natural disasters, pandemics, or government orders).
              </p>
            </section>

            <section id="contact">
              <h3>13. Contact Information</h3>
              <p>If you have any questions or queries regarding these Terms, please contact:</p>
              <p style={{ marginTop: "16px", fontWeight: 600 }}>Naksh Foundation</p>
              <p style={{ color: "var(--text-secondary)" }}>
                Email: <a href="mailto:hello@naksh.org" style={{ color: "var(--primary)" }}>hello@naksh.org</a>
                <br />
                Phone: +91 82873 93301
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

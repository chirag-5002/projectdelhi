export default function Privacy() {
  const sections = [
    { id: "intro", title: "Introduction" },
    { id: "collect", title: "1. Information We Collect" },
    { id: "use", title: "2. How We Use Your Information" },
    { id: "basis", title: "3. Legal Basis and Consent" },
    { id: "donor", title: "4. Donor and Supporter Privacy" },
    { id: "share", title: "5. How We Share Your Information" },
    { id: "cookies", title: "6. Cookies and Analytics" },
    { id: "security", title: "7. Data Security" },
    { id: "retention", title: "8. Data Retention" },
    { id: "rights", title: "9. Your Rights and Choices" },
    { id: "thirdparty", title: "10. Third-Party Websites" },
    { id: "transfers", title: "11. International Transfers" },
    { id: "updates", title: "12. Updates to This Policy" },
    { id: "contact", title: "13. Contact Us" },
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
            Privacy Policy
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

          {/* Right Column: Actual Privacy Policy Content */}
          <div className="legal-content-card">
            <section id="intro">
              <p>
                Naksh Foundation (“we”, “us”, “our”) is a non‑profit organization based in India working to promote cyber safety, digital literacy, and cybercrime awareness, including through our flagship initiative Project CyberShield. This Privacy Policy explains how we collect, use, store, and protect personal information when you interact with us through our websites and online platforms.
              </p>
              <p style={{ marginTop: "16px" }}>
                This Privacy Policy applies to domains managed by Naksh Foundation:
              </p>
              <ul style={{ marginTop: "8px" }}>
                <li>naksh.org</li>
                <li>nakshfoundation.org</li>
                <li>projectdelhi.org</li>
                <li>projectcybershield.in</li>
                <li>projectcybershield.org</li>
                <li>and any other subdomains we may operate</li>
              </ul>
              <p style={{ marginTop: "16px", fontWeight: 600 }}>
                By using our websites or submitting information to us, you agree to the practices described in this Privacy Policy.
              </p>
            </section>

            <section id="collect">
              <h3>1. Information We Collect</h3>
              <p>We may collect the following categories of information:</p>
              <ul>
                <li><strong>Contact information:</strong> name, email address, phone number, postal address, organization/college/school name, designation, and city/state.</li>
                <li><strong>Program and event information:</strong> details you provide when registering for webinars, workshops, courses, competitions, or awareness sessions (for example, class/semester, stream, college/university, age group, and areas of interest related to cyber safety).</li>
                <li><strong>Donor and supporter information:</strong> name, contact details, donation amount and date, preferred causes, and communication preferences; payment card details are handled by our secure payment gateway providers and are not stored in full on our systems.</li>
                <li><strong>Volunteer and partner information:</strong> information provided in volunteer sign‑up forms, partnership forms, or collaboration proposals.</li>
                <li><strong>Technical information:</strong> IP address, browser type, device information, pages visited, time and duration of visit, and referring URLs, collected through cookies and similar technologies.</li>
                <li><strong>Communications:</strong> content of emails, feedback forms, surveys, or other messages you send to us.</li>
              </ul>
              <p style={{ marginTop: "16px" }}>
                We do not intentionally collect personal information from children under 18 without appropriate consent from a parent, guardian, or responsible institution (such as a school). Where our programs involve school students, data is generally collected through teachers, schools, or parents, not directly from children.
              </p>
            </section>

            <section id="use">
              <h3>2. How We Use Your Information</h3>
              <p>We use personal information for the following purposes:</p>
              <ul>
                <li>To register you for webinars, workshops, training programs, and events, and to share access details and certificates.</li>
                <li>To manage and acknowledge donations, issue receipts, maintain statutory records, and share impact updates with donors.</li>
                <li>To send cyber awareness content, newsletters, program updates, and invitations to future initiatives, where you have opted to receive such communications.</li>
                <li>To coordinate volunteers, speakers, academic partners, and institutional collaborations.</li>
                <li>To respond to your queries, feedback, or support requests.</li>
                <li>To operate, maintain, and improve our websites, including monitoring usage patterns and preventing misuse or security incidents.</li>
                <li>To comply with applicable laws and regulations, including accounting, audit, and data protection requirements.</li>
              </ul>
              <p style={{ marginTop: "16px" }}>
                We will not use your personal information for purposes that are materially different from those described here without informing you and, where required, obtaining your consent.
              </p>
            </section>

            <section id="basis">
              <h3>3. Legal Basis and Consent</h3>
              <p>Where Indian data protection law requires a legal basis, we process your personal information based on one or more of the following:</p>
              <ul>
                <li><strong>Your consent:</strong> for example when you subscribe to our mailing list or submit optional information in forms.</li>
                <li><strong>Performance of a contract:</strong> or to take steps at your request, such as processing a registration or donation.</li>
                <li><strong>Compliance with legal obligations:</strong> including obligations under Indian law related to records, taxation, and regulatory reporting.</li>
                <li><strong>Our legitimate interests:</strong> as a non‑profit organization, such as running awareness programs, managing supporters and volunteers, ensuring cyber security, and improving our services, balanced against your rights and expectations.</li>
              </ul>
              <p style={{ marginTop: "16px" }}>
                Where we rely on consent, you may withdraw your consent at any time by contacting us or using the unsubscribe mechanism provided.
              </p>
            </section>

            <section id="donor">
              <h3>4. Donor and Supporter Privacy</h3>
              <p>We value the trust of our donors and supporters and are committed to protecting their information.</p>
              <ul>
                <li>We do not sell, rent, or trade donors’ or supporters’ personal information with any other organization.</li>
                <li>We do not send mailings to our donors on behalf of other organizations.</li>
                <li>If donations are processed through third‑party payment service providers, donor information is used only for purposes necessary to process the donation and comply with law.</li>
                <li>You may contact us at any time to update your donor information or to request that we limit certain types of communication.</li>
              </ul>
            </section>

            <section id="share">
              <h3>5. How We Share Your Information</h3>
              <p>We limit sharing of personal information to what is necessary and proportionate. We may share information in the following situations:</p>
              <ul>
                <li><strong>Service providers:</strong> with trusted third‑party vendors who perform services for us, such as payment processing, email delivery, event registration tools, website hosting, or analytics. These service providers are expected to protect your information and use it only to provide services to us.</li>
                <li><strong>Partners and collaborators:</strong> limited information may be shared with institutional partners (for example, colleges, schools, event co‑hosts) where necessary for managing a joint program, issuing certificates, or complying with reporting requirements, and only to the extent reasonably necessary.</li>
                <li><strong>Legal and compliance:</strong> when required by law, regulation, court order, or government authority, or when we believe disclosure is necessary to protect our rights, safety, or that of others.</li>
              </ul>
              <p style={{ marginTop: "16px" }}>
                We do not permit third parties to use your personal information for their own marketing purposes without your explicit consent.
              </p>
            </section>

            <section id="cookies">
              <h3>6. Cookies and Analytics</h3>
              <p>Our websites may use cookies and similar technologies to:</p>
              <ul>
                <li>Enable core site functionality and security.</li>
                <li>Remember your preferences and improve user experience.</li>
                <li>Understand how visitors use our sites so we can improve our content and design.</li>
              </ul>
              <p style={{ marginTop: "16px" }}>
                We may use third‑party analytics tools (such as Google Analytics) that collect aggregated information about website usage. These tools operate under their own privacy policies and may set their own cookies.
                Most web browsers allow you to control cookies through settings. If you disable cookies, some website features may not work as intended.
              </p>
            </section>

            <section id="security">
              <h3>7. Data Security</h3>
              <p>We use reasonable physical, technical, and organizational measures to protect personal information from unauthorized access, loss, misuse, or alteration. These may include:</p>
              <ul>
                <li>Use of secure servers and encryption (such as HTTPS) for data transmission.</li>
                <li>Role‑based access controls and limited access to personal data on a need‑to‑know basis.</li>
                <li>Internal awareness on data protection and responsible handling of personal data, aligned with our cyber safety mission.</li>
              </ul>
              <p style={{ marginTop: "16px" }}>
                Despite our efforts, no method of transmission or storage is completely secure. We cannot guarantee absolute security, but we strive to follow good practices recommended for nonprofits and Indian organizations.
              </p>
            </section>

            <section id="retention">
              <h3>8. Data Retention</h3>
              <p>
                We retain personal information only as long as necessary for the purposes described in this Privacy Policy or as required by Indian law (for example, for financial record‑keeping, audit, and taxation).
                When personal information is no longer needed, we will delete it or anonymize it, subject to any legal obligations to retain records for a longer period.
              </p>
            </section>

            <section id="rights">
              <h3>9. Your Rights and Choices</h3>
              <p>Depending on applicable law and your relationship with us, you may have the right to:</p>
              <ul>
                <li>Request access to the personal information we hold about you.</li>
                <li>Request correction of inaccurate or incomplete information.</li>
                <li>Request deletion of your information in certain circumstances.</li>
                <li>Object to or restrict certain kinds of processing, such as direct email communications.</li>
                <li>Withdraw consent where processing is based on your consent.</li>
              </ul>
              <p style={{ marginTop: "16px" }}>
                To exercise these rights or update your information, you can contact us using the details in the “Contact Us” section below. We may need to verify your identity before responding to your request.
                You may also opt out of our email communications at any time by clicking the “unsubscribe” link in our emails or writing to us.
              </p>
            </section>

            <section id="thirdparty">
              <h3>10. Third‑Party Websites and Social Media</h3>
              <p>
                Our websites may link to third‑party websites, tools, or social media platforms (such as YouTube, LinkedIn, or event registration platforms). These external sites are governed by their own privacy policies, and we are not responsible for their practices.
                We encourage you to review the privacy policies of any external websites you visit.
              </p>
            </section>

            <section id="transfers">
              <h3>11. International Transfers</h3>
              <p>
                Our primary operations and servers are located in India. If we use service providers or tools that process data outside India, your information may be transferred to and processed in those countries, which may have different data protection standards.
                Where required, we will take steps to ensure that any such transfers comply with applicable Indian law and that appropriate safeguards are in place.
              </p>
            </section>

            <section id="updates">
              <h3>12. Updates to This Policy</h3>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in law, technology, or our activities. When we do so, we will revise the “Last updated” date at the top of this page.
                In case of significant changes, we may also provide a more prominent notice on our websites.
              </p>
            </section>

            <section id="contact">
              <h3>13. Contact Us</h3>
              <p>If you have any questions, concerns, or requests about this Privacy Policy or how we handle your personal information, please contact:</p>
              <p style={{ marginTop: "16px", fontWeight: 600 }}>Naksh Foundation</p>
              <p style={{ color: "var(--text-secondary)" }}>
                Email: <a href="mailto:hello@naksh.org" style={{ color: "var(--primary)" }}>hello@naksh.org</a>
                <br />
                Website: <a href="https://naksh.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", textDecoration: "none" }}>naksh.org</a> | <a href="https://nakshfoundation.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", textDecoration: "none" }}>nakshfoundation.org</a> | <a href="https://projectcybershield.in" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", textDecoration: "none" }}>projectcybershield.in</a> | <a href="https://projectcybershield.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", textDecoration: "none" }}>projectcybershield.org</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonationPolicy() {
  return (
    <div className="container page-section page-enter">
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: 16 }}>Donation & Refund Policy</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Last updated: June 26, 2026</p>
        
        <div className="card" style={{ padding: 32, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 24 }}>
          <section>
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>1. Tax Exemption (80G Status)</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Project Delhi Foundation is a registered Section 8 non-profit organization in India. All monetary donations are eligible for tax deduction benefits under Section 80G of the Income Tax Act. A valid receipt along with the 80G certificate will be sent to your registered email address post verification of the donation.
            </p>
          </section>

          <section>
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>2. Utilization of Funds</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              We ensure complete transparency in our operations. Donations are utilized strictly for project implementation, procurement of supplies (e.g. tree saplings, paint, dustbins, study kits), and logistics. Project Delhi maintains audited accounts that are made public annually.
            </p>
          </section>

          <section>
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>3. Refund Policy</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              As a rule, donations once made cannot be refunded or cancelled, as they are immediately allocated to active community projects. In exceptional circumstances (such as accidental double payment or unauthorized card use), please reach out to us at hello@projectdelhi.org within 7 days of the transaction with transaction details.
            </p>
          </section>

          <section>
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>4. Donor Privacy</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              We respect your privacy and protect your personal details. We do not sell or trade donor lists. If you wish to remain anonymous in our public donor lists, please select the anonymous option while donating or write to us directly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

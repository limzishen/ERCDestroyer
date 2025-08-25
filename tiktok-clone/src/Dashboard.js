import React from "react";

const styles = {
  container: {
    display: "flex",
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, 'sans-serif'",
    background: "#fff",
    minHeight: "100vh",
    color: "#161823",
  },
  sidebar: {
    width: 240,
    background: "#fafafb",
    display: "flex",
    flexDirection: "column",
    padding: "32px 16px 0 16px",
    borderRight: "1px solid #ececec",
    minHeight: "100vh",
  },
  uploadButton: {
    background: "#ff2350",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "16px",
    fontWeight: 700,
    fontSize: 16,
    boxShadow: "0 4px 16px rgba(255,35,80,0.15)",
    marginBottom: 32,
    cursor: "pointer",
  },
  sidebarSection: {
    margin: "24px 0",
    fontSize: 14,
    fontWeight: 600,
    color: "#888",
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
    fontSize: 16,
    color: "#161823",
    cursor: "pointer",
    fontWeight: 600,
    borderRadius: 6,
    transition: "background 0.2s",
  },
  sidebarItemActive: {
    background: "#ececec",
    color: "#161823",
  },
  content: {
    flex: 1,
    padding: "0 40px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 60,
    borderBottom: "1px solid #ececec",
    padding: "0 0 0 8px",
    background: "#fff",
    fontWeight: 600,
    fontSize: 18,
  },
  tabs: {
    display: "flex",
    gap: 30,
    marginLeft: 40,
    marginTop: 6,
    fontSize: 16,
    fontWeight: 600,
  },
  tabActive: {
    borderBottom: "2px solid #000",
    paddingBottom: 4,
  },
  analyticsContainer: {
    display: "flex",
    gap: 20,
    marginTop: 32,
  },
  analyticsCard: {
    flex: 1,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "22px 0",
    fontWeight: 600,
    minWidth: 140,
    minHeight: 110,
  },
  analyticsValue: {
    fontSize: 36,
    fontWeight: 700,
    color: "#0095e6",
    marginTop: 4,
  },
  analyticsDelta: {
    fontSize: 14,
    color: "#888",
    marginTop: 0,
  },
  chartSection: {
    background: "#fff",
    borderRadius: 12,
    marginTop: 16,
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    minHeight: 200,
  },
  chartLine: {
    display: "flex",
    alignItems: "flex-end",
    height: 80,
    borderBottom: "2px solid #ececec",
    marginBottom: 16,
    position: "relative",
  },
  chartDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#0095e6",
    position: "absolute",
    bottom: -4,
  },
  chartLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    color: "#888",
    fontWeight: 600,
  },
  downloadSection: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    marginLeft: "auto",
    marginRight: 8,
    fontWeight: 600,
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    marginLeft: 10,
    background: "#ffdf7e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    color: "#ff2350",
    fontWeight: 700,
  },
};

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <button style={styles.uploadButton}>+ Upload</button>
      <div>
        <div style={styles.sidebarSection}>MANAGE</div>
        <div style={styles.sidebarItem}>Home</div>
        <div style={styles.sidebarItem}>Posts</div>
        <div style={{ ...styles.sidebarItem, ...styles.sidebarItemActive }}>Analytics</div>
        <div style={styles.sidebarItem}>Comments</div>
      </div>
      <div>
        <div style={styles.sidebarSection}>TOOLS</div>
        <div style={styles.sidebarItem}>Inspiration</div>
        <div style={styles.sidebarItem}>Creator Academy</div>
        <div style={styles.sidebarItem}>Unlimited Sounds</div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div style={styles.header}>
      <img src="https://static.tiktok.com/logo.svg" alt="TikTok Studio" style={{ height: 28, marginRight: 10 }} />
      <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: "-1px" }}>TikTok Studio</span>
      <div style={styles.tabs}>
        <span style={styles.tabActive}>Overview</span>
        <span style={{ color: "#888" }}>Content</span>
        <span style={{ color: "#888" }}>Viewers</span>
        <span style={{ color: "#888" }}>Followers</span>
      </div>
      <div style={styles.downloadSection}>
        <div>
          <select style={{ fontWeight: 600, padding: "6px 12px", borderRadius: 6, border: "1px solid #ececec" }}>
            <option>Last 7 days</option>
          </select>
        </div>
        <button
          style={{
            fontWeight: 600,
            background: "none",
            border: "1px solid #ececec",
            borderRadius: 6,
            padding: "6px 18px",
            color: "#0095e6",
            cursor: "pointer",
          }}
        >
          ↑ Download data
        </button>
        <div style={styles.profileAvatar}>🧠</div>
      </div>
    </div>
  );
}

function AnalyticsCard({ title, value, delta }) {
  return (
    <div style={styles.analyticsCard}>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{title}</div>
      <div style={styles.analyticsValue}>{value}</div>
      <div style={styles.analyticsDelta}>{delta}</div>
    </div>
  );
}

function AnalyticsPanel() {
  return (
    <div style={styles.analyticsContainer}>
      <AnalyticsCard title="Video views" value="0" delta="0 (--)" />
      <AnalyticsCard title="Profile views" value="0" delta="↓ -2 (-100.0%)" />
      <AnalyticsCard title="Likes" value="0" delta="0 (--)" />
      <AnalyticsCard title="Comments" value="0" delta="0 (--)" />
      <AnalyticsCard title="Shares" value="0" delta="0 (--)" />
    </div>
  );
}

function TimelineChart() {
  // The timeline dots will imitate the sample, all values are zero
  const dates = ["Aug 16", "Aug 17", "Aug 18", "Aug 19", "Aug 20", "Aug 21", "Aug 22"];
  return (
    <div style={styles.chartSection}>
      <div style={styles.chartLine}>
        {dates.map((date, idx) => (
          <div
            key={date}
            style={{
              ...styles.chartDot,
              left: `${(idx / (dates.length - 1)) * 99}%`,
              background: "#0095e6",
            }}
          />
        ))}
      </div>
      <div style={styles.chartLabels}>
        {dates.map(date => (
          <span key={date}>{date}</span>
        ))}
      </div>
    </div>
  );
}

export default function TikTokDashboard() {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <Header />
        <AnalyticsPanel />
        <TimelineChart />
      </div>
    </div>
  );
}

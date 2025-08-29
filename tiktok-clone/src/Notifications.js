import React from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <button className="uploadButton">+ Upload</button>
      <div>
        <div className="sidebarSection">MANAGE</div>
        <div className="sidebarItem">Home</div>
        <div className="sidebarItem">Posts</div>
        <div className="sidebarItem ">Analytics</div>
        <div
          className="sidebarItem"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/deepanalytics")}
        >
          Deep Analytics
        </div>
        <div className="sidebarItem">Comments</div>
      </div>
      <div>
        <div className="sidebarSection">TOOLS</div>
        <div className="sidebarItem">Inspiration</div>
        <div className="sidebarItem">Creator Academy</div>
        <div className="sidebarItem">Unlimited Sounds</div>
      </div>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();
  return (
    <div className="header">
      <img
        src="data:image/png;base64,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"
        alt="TikTok Studio"
        style={{ height: 28 }}
      />
      <div className="tabs">
        <span className="tabActive">Overview</span>
        <span style={{ color: "#888" }}>Content</span>
        <span style={{ color: "#888" }}>Viewers</span>
        <span style={{ color: "#888" }}>Followers</span>
        <span
          style={{ color: "#888", cursor: "pointer" }}
          onClick={() => navigate("/notifications")}
        >
          Notifications
        </span>
      </div>
      <div className="downloadSection">
        <div>
          <select
            style={{
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #ececec",
            }}
          >
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
        <div className="profileAvatar">🧠</div>
      </div>
    </div>
  );
}

function AnalyticsCard({ title, value, delta }) {
  return (
    <div className="analyticsCard">
      <div>{title}</div>
      <div className="analyticsValue">{value}</div>
      <div className="analyticsDelta">{delta}</div>
    </div>
  );
}

function AnalyticsPanel() {
  return (
    <div className="analyticsContainer">
      <AnalyticsCard title="Video views" value="0" delta="0 (--)" />
      <AnalyticsCard title="Profile views" value="0" delta="0 (--)" />
      <AnalyticsCard title="Likes" value="0" delta="0 (--)" />
      <AnalyticsCard title="Comments" value="0" delta="0 (--)" />
      <AnalyticsCard title="Shares" value="0" delta="0 (--)" />
    </div>
  );
}

function TimelineChart() {
  const dates = [
    "Aug 16",
    "Aug 17",
    "Aug 18",
    "Aug 19",
    "Aug 20",
    "Aug 21",
    "Aug 22",
  ];
  return (
    <div className="chartSection">
      <div className="chartLine">
        {dates.map((date, idx) => (
          <div
            key={date}
            className="chartDot"
            style={{ left: `${(idx / (dates.length - 1)) * 99}%` }}
          />
        ))}
      </div>
      <div className="chartLabels">
        {dates.map((date) => (
          <span key={date}>{date}</span>
        ))}
      </div>
    </div>
  );
}

export default function Notifications() {
  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <Header />
        <AnalyticsPanel />
        <TimelineChart />
      </div>
    </div>
  );
}

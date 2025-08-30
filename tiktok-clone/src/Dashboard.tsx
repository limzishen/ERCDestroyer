import React, { useState } from "react";
import "./Dashboard.css";
import PostsPage from "./PostsPage";
import { useNavigate } from "react-router-dom";
import tiktokLogo from "./assets/TikTok-Icon.png";
import danceThumbnail from "./assets/dance_thumbnail.jpeg"
import morningRoutine from "./assets/morning_routine.jpeg"
import cookingThumbnail from "./assets/cooking_thumbnail.jpeg"
import productThumbnail from "./assets/product_review.jpeg"


// Mock data for posts grid
const postsData = [
  {
    id: "post_1",
    title: "Viral Dance Trend",
    thumbnail: danceThumbnail,
    views: 850000,
    likes: 45000,
    revenue: 1247.30,
    postedDate: "2024-08-15",
    duration: "0:32"
  },
  {
    id: "post_2",
    title: "Cooking Tutorial",
    thumbnail: cookingThumbnail,
    views: 320000,
    likes: 28000,
    revenue: 1580.75,
    postedDate: "2024-08-20",
    duration: "1:15"
  },
  {
    id: "post_3",
    title: "Morning Routine",
    thumbnail: morningRoutine,
    views: 520000,
    likes: 32000,
    revenue: 980.45,
    postedDate: "2024-08-18",
    duration: "0:45"
  },
  {
    id: "post_4",
    title: "Product Review",
    thumbnail: productThumbnail,
    views: 180000,
    likes: 15000,
    revenue: 2100.80,
    postedDate: "2024-08-22",
    duration: "2:30"
  }
];

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <div className="sidebar">
      <button className="uploadButton">+ Upload</button>
      <div>
        <div className="sidebarSection">MANAGE</div>
        <div 
          className={`sidebarItem ${activePage === 'home' ? 'sidebarItemActive' : ''}`}
          onClick={() => setActivePage('home')}
        >
          Home
        </div>
        <div 
          className={`sidebarItem ${activePage === 'posts' ? 'sidebarItemActive' : ''}`}
          onClick={() => setActivePage('posts')}
        >
          Posts
        </div>
        <div 
          className={`sidebarItem ${activePage === 'analytics' ? 'sidebarItemActive' : ''}`}
          onClick={() => setActivePage('analytics')}
        >
          Analytics
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
        src={tiktokLogo}
        alt="TikTok Studio"
        style={{ height: 50 }}
      />
      <div className="tabs">
        <span
          className="tabActive"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          Overview
        </span>
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

interface AnalyticsCardProps {
  title: string;
  value: string;
  delta: string;
}

function AnalyticsCard({ title, value, delta }: AnalyticsCardProps) {
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
      <AnalyticsCard title="Video views" value="10923" delta="+ 1223" />
      <AnalyticsCard title="Profile views" value="13423" delta="+ 321" />
      <AnalyticsCard title="Likes" value="1202" delta="+ 16" />
      <AnalyticsCard title="Comments" value="384" delta="+ 32" />
      <AnalyticsCard title="Shares" value="62" delta="+ 8" />
    </div>
  );
}

function TimelineChart() {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const dates = [
    "Aug 16",
    "Aug 17",
    "Aug 18",
    "Aug 19",
    "Aug 20",
    "Aug 21",
    "Aug 22",
  ];
  
  // Mock data for video views across 7 days
  const videoViewsData = [800, 1200, 1800, 2200, 3400, 5928, 10923];
  const maxViews = Math.max(...videoViewsData);
  
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert mouse position to data coordinates
    const svgWidth = rect.width;
    const dataIndex = Math.round(((x + 280) / 1150) * 6);
    
    if (dataIndex >= 0 && dataIndex < videoViewsData.length) {
      const value = videoViewsData[dataIndex];
      const date = dates[dataIndex];
      setHoveredValue(value);
      setHoveredDate(date);
      setMousePosition({ x: event.clientX, y: event.clientY });
    } else {
      setHoveredValue(null);
      setHoveredDate(null);
    }
  };
  
  const handleMouseLeave = () => {
    setHoveredValue(null);
    setHoveredDate(null);
  };
  
  return (
    <div className="chartSection">
      <h3 className="chartTitle">Total Video Views (7 Days)</h3>
      <div className="chartContainer">
        <svg 
          width="100%" 
          height="200" 
          viewBox="0 0 600 200" 
          className="chartSvg"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: 'crosshair' }}
        >
          {/* Chart line spanning full width */}
          <path
            d={videoViewsData.map((value, index) => {
              const x = -280 + (index / 6) * 1150;
              const y = 180 - (value / maxViews) * 160;
              return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="#0095e6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points aligned with dates */}
          {videoViewsData.map((value, index) => {
            const x = -280 + (index / 6) * 1150;
            const y = 180 - (value / maxViews) * 160;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#0095e6"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {/* Tooltip */}
        {hoveredValue !== null && hoveredDate !== null && (
          <div 
            className="chart-tooltip"
            style={{
              position: 'fixed',
              left: mousePosition.x + 10,
              top: mousePosition.y - 40,
              backgroundColor: '#161823',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              pointerEvents: 'none',
              zIndex: 1000,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <div>{hoveredDate}</div>
            <div>{hoveredValue.toLocaleString()} views</div>
          </div>
        )}
      </div>
      <div className="chartLabels">
        {dates.map((date) => (
          <span key={date}>{date}</span>
        ))}
      </div>
    </div>
  );
}

// Tab Navigation Component
function TabNavigation({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <div className="overview-tab-navigation">
      <button 
        className={`overview-tab-button ${activeTab === 'general' ? 'active' : ''}`}
        onClick={() => setActiveTab('general')}
      >
        General
      </button>
      <button 
        className={`overview-tab-button ${activeTab === 'posts' ? 'active' : ''}`}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </button>
    </div>
  );
}

// Posts Grid Component
function PostsGrid({ posts }: { posts: any[] }) {
  const navigate = useNavigate();
  
  return (
    <div className="overview-posts-grid">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="overview-post-card"
          onClick={() => navigate(`/post-analytics/${post.id}`)}
        >
          <div className="overview-video-preview">
            <img 
              src={post.thumbnail} 
              alt={post.title}
              className="overview-video-thumbnail"
            />
            <div className="overview-video-overlay">
              <div className="overview-play-button">▶</div>
              <div className="overview-video-duration">{post.duration}</div>
            </div>
          </div>
          <div className="overview-post-content">
            <h4 className="overview-post-title">{post.title}</h4>
            <div className="overview-post-metrics">
              <div className="overview-metric-row">
                <span>Views:</span>
                <span>{post.views.toLocaleString()}</span>
              </div>
              <div className="overview-metric-row">
                <span>Likes:</span>
                <span>{post.likes.toLocaleString()}</span>
              </div>
              <div className="overview-metric-row">
                <span>Revenue:</span>
                <span className="overview-revenue">${post.revenue.toFixed(2)}</span>
              </div>
            </div>
            <div className="overview-post-date">{post.postedDate}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// General Tab Content
function GeneralTab() {
  const navigate = useNavigate();
  
  return (
    <div className="general-tab-content">
      <AnalyticsPanel />
      <TimelineChart />
      <button 
        className="advanced-analytics-button"
        onClick={() => navigate('/advanced-analytics')}
      >
        Advanced Analytics
      </button>
    </div>
  );
}

export default function TikTokDashboard() {
  const [activePage, setActivePage] = useState('analytics');
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="content">
        {activePage === 'posts' ? (
          <PostsPage />
        ) : (
          <>
            <Header />
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === 'general' ? (
              <GeneralTab />
            ) : (
              <PostsGrid posts={postsData} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

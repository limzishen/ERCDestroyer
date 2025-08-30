import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './PostAnalytics.css';

// Mock Data
const postAnalyticsData = {
  "post_1": {
    id: "post_1",
    title: "Viral Dance Trend",
    thumbnail: "https://via.placeholder.com/400x600/ff2350/ffffff?text=Dance+Trend",
    postedDate: "Apr 27, 2025, 11:28 AM",
    duration: "0:32",
    metrics: {
      views: 639,
      likes: 20,
      comments: 1,
      shares: 1,
      saved: 0,
      totalPlayTime: "0h:40m:19s",
      averageWatchTime: "3.8s",
      fullVideoWatchRate: 1.26,
      newFollowers: 3
    },
    retentionData: [
      { timestamp: "00:00", percentage: 100 },
      { timestamp: "00:03", percentage: 85 },
      { timestamp: "00:07", percentage: 65 },
      { timestamp: "00:14", percentage: 35 },
      { timestamp: "00:18", percentage: 20 },
      { timestamp: "00:22", percentage: 15 }
    ],
    trafficSources: [
      { source: "For You", percentage: 77.9 },
      { source: "Other", percentage: 16.7 },
      { source: "Personal profile", percentage: 4.9 },
      { source: "Search", percentage: 0.3 },
      { source: "Following", percentage: 0.2 },
      { source: "Sound", percentage: 0.0 }
    ],
    viewsTrend: [
      { date: "Day 1", views: 279 },
      { date: "Day 2", views: 186 },
      { date: "Day 3", views: 140 },
      { date: "Day 4", views: 93 },
      { date: "Day 5", views: 67 }
    ]
  },
  "post_2": {
    id: "post_2",
    title: "Cooking Tutorial",
    thumbnail: "https://via.placeholder.com/400x600/00d4aa/ffffff?text=Cooking+Tutorial",
    postedDate: "Apr 25, 2025, 2:15 PM",
    duration: "1:15",
    metrics: {
      views: 1247,
      likes: 89,
      comments: 12,
      shares: 8,
      saved: 15,
      totalPlayTime: "1h:23m:45s",
      averageWatchTime: "6.2s",
      fullVideoWatchRate: 8.5,
      newFollowers: 12
    },
    retentionData: [
      { timestamp: "00:00", percentage: 100 },
      { timestamp: "00:10", percentage: 92 },
      { timestamp: "00:25", percentage: 78 },
      { timestamp: "00:45", percentage: 65 },
      { timestamp: "01:00", percentage: 45 },
      { timestamp: "01:15", percentage: 32 }
    ],
    trafficSources: [
      { source: "For You", percentage: 82.3 },
      { source: "Other", percentage: 12.1 },
      { source: "Personal profile", percentage: 3.8 },
      { source: "Search", percentage: 1.2 },
      { source: "Following", percentage: 0.4 },
      { source: "Sound", percentage: 0.2 }
    ],
    viewsTrend: [
      { date: "Day 1", views: 456 },
      { date: "Day 2", views: 389 },
      { date: "Day 3", views: 234 },
      { date: "Day 4", views: 167 },
      { date: "Day 5", views: 1 }
    ]
  }
};

// Helper Components
const MetricCard = ({ title, value, subtitle, color = "#0095e6" }: {
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
}) => (
  <div className="post-analytics-metric-card">
    <h3 className="post-analytics-metric-title">{title}</h3>
    <div className="post-analytics-metric-value" style={{ color }}>{value}</div>
    {subtitle && <div className="post-analytics-metric-subtitle">{subtitle}</div>}
  </div>
);

const RetentionGraph = ({ data }: { data: Array<{ timestamp: string; percentage: number }> }) => {
  const [currentTime, setCurrentTime] = useState(0);
  
  // Convert timestamp to seconds for continuous data
  const getSecondsFromTimestamp = (timestamp: string) => {
    const [minutes, seconds] = timestamp.split(':').map(Number);
    return minutes * 60 + seconds;
  };
  
  // Get total video duration in seconds
  const totalDuration = getSecondsFromTimestamp(data[data.length - 1].timestamp);
  
  // Create continuous data points (one for each second)
  const continuousData = [];
  for (let second = 0; second <= totalDuration; second++) {
    // Find the appropriate percentage for this second
    let percentage = 100;
    for (let i = 0; i < data.length - 1; i++) {
      const currentTime = getSecondsFromTimestamp(data[i].timestamp);
      const nextTime = getSecondsFromTimestamp(data[i + 1].timestamp);
      
      if (second >= currentTime && second <= nextTime) {
        // Linear interpolation between two points
        const progress = (second - currentTime) / (nextTime - currentTime);
        percentage = data[i].percentage + (data[i + 1].percentage - data[i].percentage) * progress;
        break;
      }
    }
    continuousData.push({ second, percentage });
  }
  
  // Get current percentage based on slider position
  const currentPercentage = continuousData[Math.floor(currentTime)]?.percentage || 100;
  
  // Calculate average watch percentage
  const averageWatchPercentage = continuousData.reduce((sum, point) => sum + point.percentage, 0) / continuousData.length;
  
  // Find the moment where most viewers lost interest (biggest drop)
  let biggestDrop = 0;
  let biggestDropTime = 0;
  for (let i = 1; i < continuousData.length; i++) {
    const drop = continuousData[i-1].percentage - continuousData[i].percentage;
    if (drop > biggestDrop) {
      biggestDrop = drop;
      biggestDropTime = continuousData[i].second;
    }
  }
  
  return (
    <div className="post-analytics-retention-container">
      <div className="post-analytics-retention-header">
        <h3 className="post-analytics-section-title">Retention rate</h3>
        <div className="post-analytics-info-icon">ℹ</div>
      </div>
      
      <div className="post-analytics-retention-description">
        On average, viewers watched {averageWatchPercentage.toFixed(0)}% of your video. Most viewers stopped watching at {Math.floor(biggestDropTime / 60)}:{(biggestDropTime % 60).toString().padStart(2, '0')}. Check out the moment in your video where most viewers lost interest.
      </div>
      
      <div className="post-analytics-retention-graph">
        <div className="post-analytics-retention-curve">
          <svg width="100%" height="200" viewBox="0 0 400 200">
            {/* Y-axis labels */}
            <text x="5" y="25" fontSize="12" fill="#888">100%</text>
            <text x="5" y="105" fontSize="12" fill="#888">50%</text>
            
            {/* Grid lines */}
            <line x1="20" y1="20" x2="380" y2="20" stroke="#f0f0f0" strokeWidth="1" />
            <line x1="20" y1="100" x2="380" y2="100" stroke="#f0f0f0" strokeWidth="1" />
            
            {/* Retention curve */}
            <path
              d={continuousData.map((point, index) => {
                const x = 20 + (index / continuousData.length) * 360;
                const y = 180 - (point.percentage / 100) * 160;
                return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#0095e6"
              strokeWidth="3"
            />
            
            {/* Current time indicator line */}
            <line
              x1={20 + (currentTime / totalDuration) * 360}
              y1="20"
              x2={20 + (currentTime / totalDuration) * 360}
              y2="180"
              stroke="#0095e6"
              strokeWidth="2"
            />
            
            {/* Current time indicator dot on curve */}
            <circle
              cx={20 + (currentTime / totalDuration) * 360}
              cy={180 - (currentPercentage / 100) * 160}
              r="4"
              fill="#0095e6"
              stroke="white"
              strokeWidth="2"
            />
            
            {/* Slider dot on x-axis */}
            <circle
              cx={20 + (currentTime / totalDuration) * 360}
              cy="190"
              r="8"
              fill="white"
              stroke="#0095e6"
              strokeWidth="2"
            />
          </svg>
        </div>
        
        <div className="post-analytics-video-slider">
          <div className="post-analytics-slider-track">
            <input
              type="range"
              min="0"
              max={totalDuration}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="post-analytics-slider-input"
            />
            <div className="post-analytics-slider-labels">
              {data.map((point, index) => (
                <div 
                  key={index} 
                  className="post-analytics-slider-label"
                  style={{ left: `${(getSecondsFromTimestamp(point.timestamp) / totalDuration) * 100}%` }}
                >
                  <span className="post-analytics-label-time">{point.timestamp}</span>
                  <span className="post-analytics-label-percentage">({point.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrafficSources = ({ data }: { data: Array<{ source: string; percentage: number }> }) => (
  <div className="post-analytics-traffic-container">
    <h3 className="post-analytics-section-title">Traffic Sources</h3>
    <div className="post-analytics-traffic-chart">
      {data.map((item, index) => (
        <div key={index} className="post-analytics-traffic-bar">
          <div className="post-analytics-traffic-label">{item.source}</div>
          <div className="post-analytics-traffic-bar-container">
            <div 
              className="post-analytics-traffic-bar-fill"
              style={{ width: `${item.percentage}%` }}
            ></div>
            <span className="post-analytics-traffic-percentage">{item.percentage}%</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ViewsTrend = ({ data }: { data: Array<{ date: string; views: number }> }) => (
  <div className="post-analytics-trend-container">
    <h3 className="post-analytics-section-title">Views Trend</h3>
    <div className="post-analytics-trend-chart">
      <svg width="100%" height="200" viewBox="0 0 400 200">
        <path
          d={data.map((point, index) => {
            const x = 20 + (index / (data.length - 1)) * 360;
            const maxViews = Math.max(...data.map(d => d.views));
            const y = 180 - (point.views / maxViews) * 160;
            return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
          }).join(' ')}
          fill="none"
          stroke="#00d4aa"
          strokeWidth="3"
        />
        {data.map((point, index) => {
          const x = 20 + (index / (data.length - 1)) * 360;
          const maxViews = Math.max(...data.map(d => d.views));
          const y = 180 - (point.views / maxViews) * 160;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#00d4aa"
            />
          );
        })}
      </svg>
      <div className="post-analytics-trend-labels">
        {data.map((point, index) => (
          <div key={index} className="post-analytics-trend-label">
            <span className="post-analytics-trend-date">{point.date}</span>
            <span className="post-analytics-trend-views">{point.views}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PostAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const [searchParams] = useSearchParams();
  const urlPostId = searchParams.get('postId');
  
  // Use postId from URL params or search params
  const finalPostId = postId || urlPostId;
  const postData = postAnalyticsData[finalPostId as keyof typeof postAnalyticsData];
  
  const [activeTab, setActiveTab] = useState<'overview' | 'viewers' | 'engagement'>('overview');
  
  if (!postData) {
    return (
      <div className="post-analytics-container">
        <div className="post-analytics-error">
          <h2>Post not found</h2>
          <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-analytics-container">
      {/* Header */}
      <div className="post-analytics-header">
        <button 
          className="post-analytics-back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Video Header */}
      <div className="post-analytics-video-header">
        <div className="post-analytics-video-preview">
          <img 
            src={postData.thumbnail} 
            alt={postData.title}
            className="post-analytics-video-thumbnail"
          />
          <div className="post-analytics-video-overlay">
            <div className="post-analytics-play-button">▶</div>
          </div>
        </div>
        <div className="post-analytics-video-info">
          <h1 className="post-analytics-video-title">{postData.title}</h1>
          <div className="post-analytics-video-meta">
            <span className="post-analytics-video-date">{postData.postedDate}</span>
            <span className="post-analytics-video-duration">{postData.duration}</span>
          </div>
        </div>
      </div>

      {/* Basic Metrics */}
      <div className="post-analytics-basic-metrics">
        <div className="post-analytics-metric">
          <span className="post-analytics-metric-label">Views</span>
          <span className="post-analytics-metric-value">{postData.metrics.views.toLocaleString()}</span>
        </div>
        <div className="post-analytics-metric">
          <span className="post-analytics-metric-label">Likes</span>
          <span className="post-analytics-metric-value">{postData.metrics.likes.toLocaleString()}</span>
        </div>
        <div className="post-analytics-metric">
          <span className="post-analytics-metric-label">Comments</span>
          <span className="post-analytics-metric-value">{postData.metrics.comments.toLocaleString()}</span>
        </div>
        <div className="post-analytics-metric">
          <span className="post-analytics-metric-label">Shares</span>
          <span className="post-analytics-metric-value">{postData.metrics.shares.toLocaleString()}</span>
        </div>
        <div className="post-analytics-metric">
          <span className="post-analytics-metric-label">Saved</span>
          <span className="post-analytics-metric-value">{postData.metrics.saved.toLocaleString()}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="post-analytics-tab-navigation">
        <button 
          className={`post-analytics-tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`post-analytics-tab-button ${activeTab === 'viewers' ? 'active' : ''}`}
          onClick={() => setActiveTab('viewers')}
        >
          Viewers
        </button>
        <button 
          className={`post-analytics-tab-button ${activeTab === 'engagement' ? 'active' : ''}`}
          onClick={() => setActiveTab('engagement')}
        >
          Engagement
        </button>
      </div>

      {/* Tab Content */}
      <div className="post-analytics-content">
        {activeTab === 'overview' && (
          <div className="post-analytics-overview">
            {/* Key Metrics */}
            <div className="post-analytics-key-metrics">
              <MetricCard 
                title="Video Views" 
                value={postData.metrics.views.toLocaleString()} 
              />
              <MetricCard 
                title="Total Play Time" 
                value={postData.metrics.totalPlayTime} 
              />
              <MetricCard 
                title="Average Watch Time" 
                value={postData.metrics.averageWatchTime} 
              />
              <MetricCard 
                title="Watched Full Video" 
                value={`${postData.metrics.fullVideoWatchRate}%`} 
              />
              <MetricCard 
                title="New Followers" 
                value={postData.metrics.newFollowers.toString()} 
                color="#00d4aa"
              />
            </div>

            {/* Views Trend */}
            <ViewsTrend data={postData.viewsTrend} />

            {/* Retention Graph */}
            <RetentionGraph data={postData.retentionData} />

            {/* Traffic Sources */}
            <TrafficSources data={postData.trafficSources} />
          </div>
        )}

        {activeTab === 'viewers' && (
          <div className="post-analytics-viewers">
            <h3>Viewers Analytics</h3>
            <p>Viewer demographics and behavior data will be displayed here.</p>
          </div>
        )}

        {activeTab === 'engagement' && (
          <div className="post-analytics-engagement">
            <h3>Engagement Analytics</h3>
            <p>Detailed engagement metrics and patterns will be displayed here.</p>
          </div>
        )}
      </div>

      {/* Advanced Analytics Button */}
      <div className="post-analytics-advanced-section">
        <button
          className="post-analytics-advanced-button"
          onClick={() => navigate(`/post-advanced-analytics/${finalPostId}`)}
        >
          Advanced Analytics
        </button>
      </div>
    </div>
  );
};

export default PostAnalytics; 
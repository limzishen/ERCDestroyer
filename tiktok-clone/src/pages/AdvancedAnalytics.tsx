import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdvancedAnalytics.css';

// Mock Data
const generalAnalytics = {
  totalRevenue: 2847.50,
  totalViews: 1250000,
  verifiedViews: 450000,
  nonVerifiedViews: 800000,
  revenueBreakdown: {
    adRevenue: 1680.25,
    brandDeals: 850.00,
    tips: 317.25
  },
  viewTiers: {
    verified: {
      views: 450000,
      revenue: 1890.50,
      revenuePerView: 0.0042
    },
    nonVerified: {
      views: 800000,
      revenue: 957.00,
      revenuePerView: 0.0012
    }
  },
  engagementMetrics: {
    averageWatchTime: 45.2,
    likeRate: 0.08,
    commentRate: 0.03,
    shareRate: 0.015
  }
};

const postsAnalytics = [
  {
    id: "post_1",
    title: "Viral Dance Trend",
    totalViews: 850000,
    verifiedViews: 280000,
    nonVerifiedViews: 570000,
    revenue: 1247.30,
    revenueBreakdown: {
      adRevenue: 892.40,
      tips: 354.90
    },
    engagementRate: 0.12,
    watchTime: 52.3,
    postedDate: "2024-08-15",
    videoThumbnail: "https://via.placeholder.com/300x400/ff2350/ffffff?text=Dance+Trend",
    duration: "0:32"
  },
  {
    id: "post_2", 
    title: "Cooking Tutorial",
    totalViews: 320000,
    verifiedViews: 180000,
    nonVerifiedViews: 140000,
    revenue: 1580.75,
    revenueBreakdown: {
      adRevenue: 780.25,
      brandDeals: 650.00,
      tips: 150.50
    },
    engagementRate: 0.18,
    watchTime: 78.6,
    postedDate: "2024-08-20",
    videoThumbnail: "https://via.placeholder.com/300x400/00d4aa/ffffff?text=Cooking+Tutorial",
    duration: "1:15"
  },
  {
    id: "post_3",
    title: "Morning Routine",
    totalViews: 520000,
    verifiedViews: 220000,
    nonVerifiedViews: 300000,
    revenue: 980.45,
    revenueBreakdown: {
      adRevenue: 650.20,
      tips: 330.25
    },
    engagementRate: 0.15,
    watchTime: 65.8,
    postedDate: "2024-08-18",
    videoThumbnail: "https://via.placeholder.com/300x400/0095e6/ffffff?text=Morning+Routine",
    duration: "0:45"
  },
  {
    id: "post_4",
    title: "Product Review",
    totalViews: 180000,
    verifiedViews: 120000,
    nonVerifiedViews: 60000,
    revenue: 2100.80,
    revenueBreakdown: {
      adRevenue: 450.30,
      brandDeals: 1500.00,
      tips: 150.50
    },
    engagementRate: 0.22,
    watchTime: 89.2,
    postedDate: "2024-08-22",
    videoThumbnail: "https://via.placeholder.com/300x400/ffd700/000000?text=Product+Review",
    duration: "2:30"
  }
];

// Revenue Source Configuration
const REVENUE_SOURCE_CONFIG = {
  adRevenue: { name: 'Ad Revenue', color: '#dd8c9c' },
  brandDeals: { name: 'Brand Deals', color: '#fe2958' },
  tips: { name: 'Tips', color: '#2af0e9' }
};

// Helper Components
const MetricCard = ({ title, value, subtitle, color = "#0095e6" }: {
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
}) => (
  <div className="analytics-metric-card">
    <h3 className="analytics-metric-title">{title}</h3>
    <div className="analytics-metric-value" style={{ color }}>{value}</div>
    {subtitle && <div className="analytics-metric-subtitle">{subtitle}</div>}
  </div>
);

const RevenueSourceChart = ({ data }: { data: Record<string, number> }) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  
  return (
    <div className="analytics-chart-container">
      <h3 className="analytics-chart-title">Revenue Sources</h3>
      <div className="analytics-revenue-chart">
        {Object.entries(data).map(([source, amount]) => {
          const percentage = ((amount / total) * 100).toFixed(1);
          const config = REVENUE_SOURCE_CONFIG[source as keyof typeof REVENUE_SOURCE_CONFIG];
          
          return (
            <div key={source} className="analytics-revenue-segment" style={{ backgroundColor: config.color }}>
              <div className="analytics-segment-content">
                <span className="analytics-source-name">{config.name}</span>
                <span className="analytics-source-amount">${amount.toFixed(2)}</span>
                <span className="analytics-source-percentage">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ViewTierBreakdown = ({ verified, nonVerified }: {
  verified: { views: number; revenue: number; revenuePerView: number };
  nonVerified: { views: number; revenue: number; revenuePerView: number };
}) => {
  const totalViews = verified.views + nonVerified.views;
  const verifiedPercentage = ((verified.views / totalViews) * 100).toFixed(1);
  const nonVerifiedPercentage = ((nonVerified.views / totalViews) * 100).toFixed(1);

  return (
    <div className="analytics-view-tier-container">
      <h3 className="analytics-chart-title">View Quality Breakdown</h3>
      <div className="analytics-tier-chart">
        <div className="analytics-tier-bar">
          <div 
            className="analytics-verified-segment" 
            style={{ width: `${verifiedPercentage}%` }}
          >
            <span className="analytics-tier-label">Verified ({verifiedPercentage}%)</span>
            <span className="analytics-tier-value">${verified.revenuePerView.toFixed(4)}/view</span>
          </div>
          <div 
            className="analytics-non-verified-segment" 
            style={{ width: `${nonVerifiedPercentage}%` }}
          >
            <span className="analytics-tier-label">Non-Verified ({nonVerifiedPercentage}%)</span>
            <span className="analytics-tier-value">${nonVerified.revenuePerView.toFixed(4)}/view</span>
          </div>
        </div>
      </div>
      <div className="analytics-tier-comparison">
        <div className="analytics-comparison-card verified">
          <h4 className="analytics-comparison-title">Verified Views</h4>
          <div className="analytics-comparison-stats">
            <div>Views: {verified.views.toLocaleString()}</div>
            <div>Revenue: ${verified.revenue.toFixed(2)}</div>
            <div>Rate: ${verified.revenuePerView.toFixed(4)}/view</div>
          </div>
        </div>
        <div className="analytics-comparison-card non-verified">
          <h4 className="analytics-comparison-title">Non-Verified Views</h4>
          <div className="analytics-comparison-stats">
            <div>Views: {nonVerified.views.toLocaleString()}</div>
            <div>Revenue: ${nonVerified.revenue.toFixed(2)}</div>
            <div>Rate: ${nonVerified.revenuePerView.toFixed(4)}/view</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PostsList = ({ posts }: { posts: typeof postsAnalytics }) => (
  <div className="analytics-posts-container">
    <h3 className="analytics-section-title">Individual Post Analytics</h3>
    <div className="analytics-posts-grid">
      {posts.map((post) => (
        <div key={post.id} className="analytics-post-card">
          <div className="analytics-video-preview">
            <img 
              src={post.videoThumbnail} 
              alt={post.title}
              className="analytics-video-thumbnail"
            />
            <div className="analytics-video-overlay">
              <div className="analytics-play-button">▶</div>
              <div className="analytics-video-duration">{post.duration}</div>
            </div>
          </div>
          <div className="analytics-post-content">
            <div className="analytics-post-header">
              <h4 className="analytics-post-title">{post.title}</h4>
              <span className="analytics-post-date">{post.postedDate}</span>
            </div>
            <div className="analytics-post-metrics">
              <div className="analytics-metric-row">
                <span>Total Views:</span>
                <span>{post.totalViews.toLocaleString()}</span>
              </div>
              <div className="analytics-metric-row">
                <span>Revenue:</span>
                <span className="analytics-revenue">${post.revenue.toFixed(2)}</span>
              </div>
              <div className="analytics-metric-row">
                <span>Engagement Rate:</span>
                <span>{(post.engagementRate * 100).toFixed(1)}%</span>
              </div>
              <div className="analytics-metric-row">
                <span>Watch Time:</span>
                <span>{post.watchTime}s</span>
              </div>
            </div>
            <div className="analytics-view-breakdown">
              <div className="analytics-verified-indicator">
                <span className="analytics-indicator-dot verified"></span>
                <span>Verified: {post.verifiedViews.toLocaleString()}</span>
              </div>
              <div className="analytics-non-verified-indicator">
                <span className="analytics-indicator-dot non-verified"></span>
                <span>Non-Verified: {post.nonVerifiedViews.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const GeneralAnalytics = () => (
  <div className="analytics-general-content">
    <div className="analytics-metrics-grid">
      <MetricCard 
        title="Total Revenue" 
        value={`$${generalAnalytics.totalRevenue.toFixed(2)}`} 
        color="#00d4aa"
      />
      <MetricCard 
        title="Total Views" 
        value={generalAnalytics.totalViews.toLocaleString()} 
        subtitle="All time"
      />
      <MetricCard 
        title="Verified Views" 
        value={generalAnalytics.verifiedViews.toLocaleString()} 
        subtitle={`${((generalAnalytics.verifiedViews / generalAnalytics.totalViews) * 100).toFixed(1)}% of total`}
        color="#ffd700"
      />
      <MetricCard 
        title="Avg. Watch Time" 
        value={`${generalAnalytics.engagementMetrics.averageWatchTime}s`} 
        subtitle="Per video"
      />
    </div>
    
    <div className="analytics-charts-section">
      <RevenueSourceChart data={generalAnalytics.revenueBreakdown} />
      <ViewTierBreakdown 
        verified={generalAnalytics.viewTiers.verified}
        nonVerified={generalAnalytics.viewTiers.nonVerified}
      />
    </div>

    <div className="analytics-insights-section">
      <h3 className="analytics-section-title">Revenue Insights</h3>
      <div className="analytics-insights-grid">
        <div className="analytics-insight-card">
          <h4 className="analytics-insight-title">Why Verified Views Matter</h4>
          <p className="analytics-insight-text">Verified users generate <strong>3.5x more revenue per view</strong> than non-verified users. This is because verified accounts are more likely to engage with ads and complete purchases.</p>
        </div>
        <div className="analytics-insight-card">
          <h4 className="analytics-insight-title">Quality Over Quantity</h4>
          <p className="analytics-insight-text">Your cooking tutorial earned more despite fewer views because it had a higher percentage of verified viewers (56% vs 33%) and better engagement rates.</p>
        </div>
      </div>
    </div>
  </div>
);

const AdvancedAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'general' | 'posts'>('general');

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <button 
          className="analytics-back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
        <h1 className="analytics-page-title">Advanced Analytics</h1>
      </div>
      
      <div className="analytics-tab-navigation">
        <button 
          className={`analytics-tab-button ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General Analytics
        </button>
        <button 
          className={`analytics-tab-button ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts Analytics
        </button>
      </div>

      <div className="analytics-content">
        {activeTab === 'general' ? (
          <GeneralAnalytics />
        ) : (
          <PostsList posts={postsAnalytics} />
        )}
      </div>
    </div>
  );
};

export default AdvancedAnalytics; 
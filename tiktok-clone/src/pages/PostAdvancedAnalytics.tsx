import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import './PostAdvancedAnalytics.css';
import danceThumbnail from "../assets/dance_thumbnail.jpeg"

// Mock Data
const postAdvancedData = {
  "post_1": {
    id: "post_1",
    title: "Viral Dance Trend",
    thumbnail: danceThumbnail,
    postedDate: "Apr 27, 2025, 11:28 AM",
    duration: "0:32",
    totalRevenue: 1247.30,
    totalViews: 850000,
    verifiedViews: 280000,
    nonVerifiedViews: 570000,
    revenueBreakdown: {
      adRevenue: 892.40,
      tips: 354.90
    },
    viewTiers: {
      verified: {
        views: 280000,
        revenue: 980.50,
        revenuePerView: 0.0035
      },
      nonVerified: {
        views: 570000,
        revenue: 266.80,
        revenuePerView: 0.0005
      }
    },
    engagementMetrics: {
      averageWatchTime: 52.3,
      likeRate: 0.12,
      commentRate: 0.05,
      shareRate: 0.03
    }
  },
  "post_2": {
    id: "post_2",
    title: "Cooking Tutorial",
    thumbnail: "https://via.placeholder.com/400x600/00d4aa/ffffff?text=Cooking+Tutorial",
    postedDate: "Apr 25, 2025, 2:15 PM",
    duration: "1:15",
    totalRevenue: 1580.75,
    totalViews: 320000,
    verifiedViews: 180000,
    nonVerifiedViews: 140000,
    revenueBreakdown: {
      adRevenue: 780.25,
      brandDeals: 650.00,
      tips: 150.50
    },
    viewTiers: {
      verified: {
        views: 180000,
        revenue: 1200.30,
        revenuePerView: 0.0067
      },
      nonVerified: {
        views: 140000,
        revenue: 380.45,
        revenuePerView: 0.0027
      }
    },
    engagementMetrics: {
      averageWatchTime: 78.6,
      likeRate: 0.18,
      commentRate: 0.08,
      shareRate: 0.05
    }
  }
};

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
  <div className="post-advanced-metric-card">
    <h3 className="post-advanced-metric-title">{title}</h3>
    <div className="post-advanced-metric-value" style={{ color }}>{value}</div>
    {subtitle && <div className="post-advanced-metric-subtitle">{subtitle}</div>}
  </div>
);

const RevenueSourceChart = ({ data }: { data: Record<string, number> }) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  
  return (
    <div className="post-advanced-chart-container">
      <h3 className="post-advanced-chart-title">Revenue Sources</h3>
      <div className="post-advanced-revenue-chart">
        {Object.entries(data).map(([source, amount]) => {
          const percentage = ((amount / total) * 100).toFixed(1);
          const config = REVENUE_SOURCE_CONFIG[source as keyof typeof REVENUE_SOURCE_CONFIG];
          
          return (
            <div key={source} className="post-advanced-revenue-segment" style={{ backgroundColor: config.color }}>
              <div className="post-advanced-segment-content">
                <span className="post-advanced-source-name">{config.name}</span>
                <span className="post-advanced-source-amount">${amount.toFixed(2)}</span>
                <span className="post-advanced-source-percentage">{percentage}%</span>
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
    <div className="post-advanced-view-tier-container">
      <h3 className="post-advanced-chart-title">View Quality Breakdown</h3>
      <div className="post-advanced-tier-chart">
        <div className="post-advanced-tier-bar">
          <div 
            className="post-advanced-verified-segment" 
            style={{ width: `${verifiedPercentage}%` }}
          >
            <span className="post-advanced-tier-label">Verified ({verifiedPercentage}%)</span>
            <span className="post-advanced-tier-value">${verified.revenuePerView.toFixed(4)}/view</span>
          </div>
          <div 
            className="post-advanced-non-verified-segment" 
            style={{ width: `${nonVerifiedPercentage}%` }}
          >
            <span className="post-advanced-tier-label">Non-Verified ({nonVerifiedPercentage}%)</span>
            <span className="post-advanced-tier-value">${nonVerified.revenuePerView.toFixed(4)}/view</span>
          </div>
        </div>
      </div>
      <div className="post-advanced-tier-comparison">
        <div className="post-advanced-comparison-card verified">
          <h4 className="post-advanced-comparison-title">Verified Views</h4>
          <div className="post-advanced-comparison-stats">
            <div>Views: {verified.views.toLocaleString()}</div>
            <div>Revenue: ${verified.revenue.toFixed(2)}</div>
            <div>Rate: ${verified.revenuePerView.toFixed(4)}/view</div>
          </div>
        </div>
        <div className="post-advanced-comparison-card non-verified">
          <h4 className="post-advanced-comparison-title">Non-Verified Views</h4>
          <div className="post-advanced-comparison-stats">
            <div>Views: {nonVerified.views.toLocaleString()}</div>
            <div>Revenue: ${nonVerified.revenue.toFixed(2)}</div>
            <div>Rate: ${nonVerified.revenuePerView.toFixed(4)}/view</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PostAdvancedAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const [searchParams] = useSearchParams();
  const urlPostId = searchParams.get('postId');
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Use postId from URL params or search params
  const finalPostId = postId || urlPostId;
  const postData = postAdvancedData[finalPostId as keyof typeof postAdvancedData];
  
  if (!postData) {
    return (
      <div className="post-advanced-container">
        <div className="post-advanced-error">
          <h2>Post not found</h2>
          <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-advanced-container">
      {/* Header */}
      <div className="post-advanced-header">
        <button 
          className="post-advanced-back-button"
          onClick={() => navigate(`/post-analytics/${finalPostId}`)}
        >
          ← Back to Post Analytics
        </button>
        <h1 className="post-advanced-page-title">Advanced Analytics</h1>
      </div>

      {/* Video Header */}
      <div className="post-advanced-video-header">
        <div className="post-advanced-video-preview">
          <img 
            src={postData.thumbnail} 
            alt={postData.title}
            className="post-advanced-video-thumbnail"
          />
          <div className="post-advanced-video-overlay">
            <div className="post-advanced-play-button">▶</div>
          </div>
        </div>
        <div className="post-advanced-video-info">
          <h2 className="post-advanced-video-title">{postData.title}</h2>
          <div className="post-advanced-video-meta">
            <span className="post-advanced-video-date">{postData.postedDate}</span>
            <span className="post-advanced-video-duration">{postData.duration}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="post-advanced-metrics-grid">
        <MetricCard 
          title="Total Revenue" 
          value={`$${postData.totalRevenue.toFixed(2)}`} 
          color="#00d4aa"
        />
        <MetricCard 
          title="Total Views" 
          value={postData.totalViews.toLocaleString()} 
        />
        <MetricCard 
          title="Verified Views" 
          value={postData.verifiedViews.toLocaleString()} 
          subtitle={`${((postData.verifiedViews / postData.totalViews) * 100).toFixed(1)}% of total`}
          color="#ffd700"
        />
        <MetricCard 
          title="Avg. Watch Time" 
          value={`${postData.engagementMetrics.averageWatchTime}s`} 
        />
      </div>

      {/* Charts Section */}
      <div className="post-advanced-charts-section">
        <RevenueSourceChart data={postData.revenueBreakdown} />
        <ViewTierBreakdown 
          verified={postData.viewTiers.verified}
          nonVerified={postData.viewTiers.nonVerified}
        />
      </div>

      {/* Revenue Insights */}
      <div className="post-advanced-insights-section">
        <h3 className="post-advanced-section-title">Revenue Insights</h3>
        <div className="post-advanced-insights-grid">
          <div className="post-advanced-insight-card">
            <h4 className="post-advanced-insight-title">Why This Video Earned More</h4>
            <p className="post-advanced-insight-text">
              This video generated <strong>${postData.totalRevenue.toFixed(2)}</strong> in revenue with 
              <strong> {postData.totalViews.toLocaleString()}</strong> views. The high revenue is attributed to:
            </p>
            <ul className="post-advanced-insight-list">
              <li>Strong verified viewer percentage ({(postData.verifiedViews / postData.totalViews * 100).toFixed(1)}%)</li>
              <li>High engagement rate ({(postData.engagementMetrics.likeRate * 100).toFixed(1)}% likes)</li>
              <li>Good watch time retention ({postData.engagementMetrics.averageWatchTime}s average)</li>
            </ul>
          </div>
          <div className="post-advanced-insight-card">
            <h4 className="post-advanced-insight-title">Revenue Optimization Tips</h4>
            <p className="post-advanced-insight-text">
              To increase revenue for similar content:
            </p>
            <ul className="post-advanced-insight-list">
              <li>Focus on content that appeals to verified users</li>
              <li>Encourage longer watch times through engaging content</li>
              <li>Optimize posting times for maximum verified user reach</li>
              <li>Build relationships with brands for sponsored content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostAdvancedAnalytics; 
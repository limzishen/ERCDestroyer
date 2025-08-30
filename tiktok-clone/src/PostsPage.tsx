import React, { useState } from 'react';
import './PostsPage.css';
import productThumbnail from "./assets/product_review.jpeg"

interface Post {
  id: string;
  thumbnail: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  duration: string;
  title: string;
}

interface UserProfile {
  username: string;
  displayName: string;
  avatar: string;
  followers: string;
  following: string;
  likes: string;
  bio: string;
}

const PostsPage = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [sortBy, setSortBy] = useState('latest');

  // Mock user data
  const userProfile: UserProfile = {
    username: 'clair3c',
    displayName: 'claire',
    avatar: 'C',
    followers: '40.8K',
    following: '198',
    likes: '344.3K',
    bio: 'No bio yet.'
  };

  // Mock posts data
  const posts: Post[] = [
    {
      id: '1',
      thumbnail: productThumbnail,
      views: '1250',
      likes: '89',
      comments: '12',
      shares: '5',
      duration: '0:15',
      title: ''
    }
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="posts-container">
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{userProfile.avatar}</span>
          </div>
          <div className="profile-info">
            <div className="profile-names">
              <h2 className="username">{userProfile.username}</h2>
              <span className="display-name">{userProfile.displayName}</span>
            </div>
            <div className="profile-actions">
              <button className="edit-profile-btn">Edit profile</button>
              <button className="promote-post-btn">Promote post</button>
              <button className="settings-btn">⚙️</button>
              <button className="share-btn">📤</button>
            </div>
            <div className="profile-stats">
              <span><strong>{userProfile.following}</strong> Following</span>
              <span><strong>{userProfile.followers}</strong> Followers</span>
              <span><strong>{userProfile.likes}</strong> Likes</span>
            </div>
            <div className="profile-bio">
              {userProfile.bio}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="content-tabs">
        <div className="tabs-container">
          <button 
            className={`tab ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </button>
          <button 
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
          <button 
            className={`tab ${activeTab === 'liked' ? 'active' : ''}`}
            onClick={() => setActiveTab('liked')}
          >
            Liked
          </button>
        </div>
        
        <div className="sort-options">
          <button 
            className={`sort-btn ${sortBy === 'latest' ? 'active' : ''}`}
            onClick={() => setSortBy('latest')}
          >
            Latest
          </button>
          <button 
            className={`sort-btn ${sortBy === 'popular' ? 'active' : ''}`}
            onClick={() => setSortBy('popular')}
          >
            Popular
          </button>
          <button 
            className={`sort-btn ${sortBy === 'oldest' ? 'active' : ''}`}
            onClick={() => setSortBy('oldest')}
          >
            Oldest
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="posts-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post-item">
              <div className="post-thumbnail">
                <img src={post.thumbnail} alt={post.title} />
                <div className="post-duration">{post.duration}</div>
                <div className="post-overlay">
                  <div className="post-stats">
                    <div className="stat">
                      <span className="stat-icon">👁️</span>
                      <span className="stat-value">{post.views}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">❤️</span>
                      <span className="stat-value">{post.likes}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">💬</span>
                      <span className="stat-value">{post.comments}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">📤</span>
                      <span className="stat-value">{post.shares}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="post-title">{post.title}</div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📱</div>
            <h3>Upload your first video</h3>
            <p>Your videos will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage; 
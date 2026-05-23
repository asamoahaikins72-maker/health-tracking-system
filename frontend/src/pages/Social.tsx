import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  achieved_at: string
}

interface SocialPost {
  id: number
  user_id: number
  username: string
  content: string
  metric_type?: string
  achievement_title?: string
  likes: number
  comments: number
  created_at: string
  liked: boolean
}

function Social() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [showShareForm, setShowShareForm] = useState(false)
  const [shareContent, setShareContent] = useState('')
  const [selectedType, setSelectedType] = useState('achievement')
  const { token, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
    fetchAchievements()
  }, [token])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/social/posts/', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements/', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setAchievements(data)
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    }
  }

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/social/posts/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: shareContent,
          post_type: selectedType,
        }),
      })
      if (response.ok) {
        setShareContent('')
        setSelectedType('achievement')
        setShowShareForm(false)
        fetchPosts()
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const likePost = async (postId: number) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Community & Achievements</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Achievements Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Achievements</h2>
          {achievements.length === 0 ? (
            <p className="text-gray-500">Keep tracking your health to unlock achievements!</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-4xl mb-2">{achievement.icon}</p>
                  <h3 className="font-bold">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(achievement.achieved_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Share Section */}
        <button
          onClick={() => setShowShareForm(!showShareForm)}
          className="mb-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showShareForm ? 'Cancel' : 'Share Achievement'}
        </button>

        {showShareForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6">Share Your Progress</h2>
            <form onSubmit={handleShare}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="achievement">Achievement</option>
                  <option value="milestone">Milestone</option>
                  <option value="challenge">Challenge</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Message</label>
                <textarea
                  value={shareContent}
                  onChange={(e) => setShareContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Share your achievement or milestone..."
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Share
              </button>
            </form>
          </div>
        )}

        {/* Community Feed */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Community Feed</h2>
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No posts yet. Be the first to share!</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-md mb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{post.username}</h3>
                    <p className="text-sm text-gray-600">{new Date(post.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-gray-800 mb-4">{post.content}</p>
                <div className="flex gap-4 text-gray-600">
                  <button
                    onClick={() => likePost(post.id)}
                    className={`flex items-center gap-1 ${
                      post.liked ? 'text-red-500' : 'hover:text-red-500'
                    }`}
                  >
                    ❤️ {post.likes}
                  </button>
                  <span>💬 {post.comments}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default Social

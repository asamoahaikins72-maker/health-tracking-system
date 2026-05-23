import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const [metrics, setMetrics] = useState([])
  const [user, setUser] = useState(null)
  const [goals, setGoals] = useState([])
  const [achievements, setAchievements] = useState([])
  const { logout, token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserProfile()
    fetchMetrics()
    fetchGoals()
    fetchAchievements()
  }, [token])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics/?limit=10', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }
  }

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals/?limit=3', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setGoals(data)
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
    }
  }

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements/?limit=3', {
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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Health Tracker</h1>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/metrics')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Metric
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Analytics
              </button>
              <button
                onClick={() => navigate('/goals')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Goals
              </button>
              <button
                onClick={() => navigate('/social')}
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
              >
                Community
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-2">Welcome, {user.full_name || user.username}! 👋</h2>
            <p className="text-gray-600">Track your health metrics and achieve your fitness goals.</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Recent Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Recent Metrics</h3>
            {metrics.length === 0 ? (
              <p className="text-gray-500">No metrics recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {metrics.slice(0, 5).map((metric: any) => (
                  <div key={metric.id} className="flex justify-between border-b pb-2">
                    <span>{metric.metric_type}</span>
                    <span className="font-bold">{metric.value} {metric.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Goals */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Active Goals</h3>
            {goals.length === 0 ? (
              <p className="text-gray-500">No active goals. Create one!</p>
            ) : (
              <div className="space-y-2">
                {goals.map((goal: any) => (
                  <div key={goal.id} className="border-b pb-2">
                    <p className="font-bold">{goal.metric_type}</p>
                    <p className="text-sm text-gray-600">Target: {goal.target_value} {goal.unit}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Recent Achievements</h3>
            <div className="grid grid-cols-6 gap-4">
              {achievements.map((achievement: any) => (
                <div key={achievement.id} className="text-center">
                  <p className="text-3xl">{achievement.icon}</p>
                  <p className="text-sm font-bold mt-2">{achievement.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard

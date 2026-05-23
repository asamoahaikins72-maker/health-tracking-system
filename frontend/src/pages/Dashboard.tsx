import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const [metrics, setMetrics] = useState([])
  const [user, setUser] = useState(null)
  const { logout, token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserProfile()
    fetchMetrics()
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
            <h2 className="text-xl font-bold mb-2">Welcome, {user.full_name || user.username}!</h2>
            <p className="text-gray-600">Track your health metrics and achieve your fitness goals.</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Recent Metrics</h3>
          {metrics.length === 0 ? (
            <p className="text-gray-500">No metrics recorded yet. Start by adding your first metric!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Value</th>
                    <th className="px-4 py-2 text-left">Unit</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric: any) => (
                    <tr key={metric.id} className="border-b hover:bg-gray-100">
                      <td className="px-4 py-2">{metric.metric_type}</td>
                      <td className="px-4 py-2">{metric.value}</td>
                      <td className="px-4 py-2">{metric.unit}</td>
                      <td className="px-4 py-2">{new Date(metric.recorded_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard

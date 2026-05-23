import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Analytics() {
  const [metrics, setMetrics] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [metricType, setMetricType] = useState('weight')
  const [timeRange, setTimeRange] = useState('30')  // days
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchMetrics()
  }, [token, metricType, timeRange])

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/metrics/?metric_type=${metricType}&limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        
        // Filter by time range
        const filtered = filterByTimeRange(data, parseInt(timeRange))
        setMetrics(data)
        setFilteredData(filtered)
      }
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }
  }

  const filterByTimeRange = (data: any[], days: number) => {
    const now = new Date()
    const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    
    return data
      .filter(m => new Date(m.recorded_at) >= pastDate)
      .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
      .map(m => ({
        ...m,
        date: new Date(m.recorded_at).toLocaleDateString(),
        value: m.value
      }))
  }

  const calculateStats = () => {
    if (filteredData.length === 0) return { min: 0, max: 0, avg: 0, latest: 0 }
    
    const values = filteredData.map(d => d.value)
    return {
      min: Math.min(...values).toFixed(2),
      max: Math.max(...values).toFixed(2),
      avg: (values.reduce((a, b) => a + b) / values.length).toFixed(2),
      latest: values[values.length - 1].toFixed(2)
    }
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Health Analytics</h1>
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
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Metric Type</label>
              <select
                value={metricType}
                onChange={(e) => setMetricType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="weight">Weight (kg)</option>
                <option value="steps">Steps</option>
                <option value="heart_rate">Heart Rate (bpm)</option>
                <option value="calories">Calories (kcal)</option>
                <option value="sleep">Sleep (hours)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </select>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Latest</p>
              <p className="text-2xl font-bold text-blue-600">{stats.latest}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Average</p>
              <p className="text-2xl font-bold text-green-600">{stats.avg}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Highest</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.max}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Lowest</p>
              <p className="text-2xl font-bold text-red-600">{stats.min}</p>
            </div>
          </div>

          {/* Chart */}
          {filteredData.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    dot={{ fill: '#3b82f6' }}
                    name={metricType}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No data available for this metric</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default Analytics

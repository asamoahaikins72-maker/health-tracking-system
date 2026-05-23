import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Goal {
  id: number
  metric_type: string
  target_value: number
  current_value: number
  unit: string
  deadline: string
  status: string
  created_at: string
}

function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    metric_type: 'weight',
    target_value: '',
    deadline: '',
  })
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchGoals()
  }, [token])

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals/', {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/goals/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        alert('Goal created successfully!')
        setFormData({ metric_type: 'weight', target_value: '', deadline: '' })
        setShowForm(false)
        fetchGoals()
      }
    } catch (error) {
      console.error('Error creating goal:', error)
    }
  }

  const calculateProgress = (goal: Goal) => {
    const progress = (goal.current_value / goal.target_value) * 100
    return Math.min(progress, 100)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const deleteGoal = async (goalId: number) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const response = await fetch(`/api/goals/${goalId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        })
        if (response.ok) {
          fetchGoals()
        }
      } catch (error) {
        console.error('Error deleting goal:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Fitness Goals</h1>
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
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Create New Goal'}
        </button>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Goal</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Metric Type</label>
                <select
                  name="metric_type"
                  value={formData.metric_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="weight">Weight (kg)</option>
                  <option value="steps">Steps per day</option>
                  <option value="calories">Calories burned (kcal)</option>
                  <option value="sleep">Sleep hours</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Target Value</label>
                <input
                  type="number"
                  step="0.1"
                  name="target_value"
                  value={formData.target_value}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Create Goal
              </button>
            </form>
          </div>
        )}

        <div className="grid gap-6">
          {goals.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No goals yet. Create one to get started!</p>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{goal.metric_type.replace('_', ' ').toUpperCase()}</h3>
                    <p className="text-gray-600">Target: {goal.target_value} {goal.unit}</p>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Progress</span>
                    <span className="font-bold">{calculateProgress(goal).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${calculateProgress(goal)}%` }}
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-600">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Status: {goal.status}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default Goals

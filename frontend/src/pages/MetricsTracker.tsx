import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const METRIC_TYPES = [
  { value: 'weight', label: 'Weight (kg)' },
  { value: 'steps', label: 'Steps' },
  { value: 'heart_rate', label: 'Heart Rate (bpm)' },
  { value: 'calories', label: 'Calories (kcal)' },
  { value: 'sleep', label: 'Sleep (hours)' },
  { value: 'blood_pressure', label: 'Blood Pressure' },
  { value: 'water_intake', label: 'Water Intake (ml)' },
]

function MetricsTracker() {
  const [metricType, setMetricType] = useState('weight')
  const [value, setValue] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const navigate = useNavigate()

  const getUnitForType = (type: string) => {
    const units: { [key: string]: string } = {
      weight: 'kg',
      steps: 'steps',
      heart_rate: 'bpm',
      calories: 'kcal',
      sleep: 'hours',
      blood_pressure: 'mmHg',
      water_intake: 'ml',
    }
    return units[type] || ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/metrics/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric_type: metricType,
          value: parseFloat(value),
          unit: getUnitForType(metricType),
          notes,
        }),
      })

      if (response.ok) {
        alert('Metric recorded successfully!')
        setMetricType('weight')
        setValue('')
        setNotes('')
        navigate('/dashboard')
      } else {
        alert('Error recording metric')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error recording metric')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Health Tracker</h1>
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
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Record Health Metric</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">Metric Type</label>
              <select
                value={metricType}
                onChange={(e) => setMetricType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {METRIC_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">
                Value ({getUnitForType(metricType)})
              </label>
              <input
                type="number"
                step="0.1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows={4}
              />
            </div>

            <div className="space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Recording...' : 'Record Metric'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default MetricsTracker

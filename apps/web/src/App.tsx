import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/health')
        if (response.data.ok) {
          setApiStatus('ok')
        } else {
          setApiStatus('error')
        }
      } catch (error) {
        setApiStatus('error')
      }
    }

    checkApi()
    const interval = setInterval(checkApi, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">KnwnCal - Project Management</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">API Status</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              apiStatus === 'loading' ? 'bg-yellow-400' :
              apiStatus === 'ok' ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            <span className="text-sm">
              {apiStatus === 'loading' && 'Checking API...'}
              {apiStatus === 'ok' && 'API is running ✅'}
              {apiStatus === 'error' && 'API is not responding ❌'}
            </span>
          </div>
          
          {apiStatus === 'ok' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800 text-sm">
                Backend is ready! Next step: Database setup and authentication.
              </p>
            </div>
          )}
          
          {apiStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-800 text-sm">
                Backend is not running. Please start the API server first.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Start the API server (pnpm api:dev)</li>
            <li>Set up database and seed data</li>
            <li>Implement authentication</li>
            <li>Build the main application features</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default App
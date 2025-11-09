import { useState } from 'react'
import { ThemeToggle } from './components/ui/ThemeToggle'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-gray-900 dark:text-lime-500 flex flex-col items-center justify-center p-8">
      <ThemeToggle />
      <h1 className="text-4xl font-bold mb-8">Vite + React</h1>
      <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-8 shadow-lg">
        <button
          onClick={() => setCount(count => count + 1)}
          className="bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 mb-4"
        >
          count is {count}
        </button>
        <p className="text-gray-600 dark:text-gray-400">
          Edit{' '}
          <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
            src/App.jsx
          </code>{' '}
          and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default App

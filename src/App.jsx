import { useState } from 'react';
import { ThemeToggle } from './components/ui/ThemeToggle';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 transition-colors duration-300">
      <ThemeToggle />
      <h1 className="text-4xl font-bold mb-8 transition-colors duration-300">
        Vite + React
      </h1>
      <div className="bg-card border border-border rounded-lg p-8 shadow-lg transition-colors duration-300">
        <button
          onClick={() => setCount(count => count + 1)}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 mb-4"
        >
          count is {count}
        </button>
        <p className="text-muted-foreground transition-colors duration-300">
          Edit <code className="bg-muted px-2 py-1 rounded transition-colors duration-300">src/App.jsx</code> and
          save to test HMR
        </p>
      </div>
    </div>
  );
}

export default App;

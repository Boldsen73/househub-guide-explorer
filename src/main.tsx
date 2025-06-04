import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeCleanEnvironment } from './utils/cleanupStorage'

// Initialize clean environment on app start
initializeCleanEnvironment();

createRoot(document.getElementById("root")!).render(<App />);

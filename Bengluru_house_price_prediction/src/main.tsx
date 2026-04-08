import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("CRITICAL: main.tsx is executing! Mounting app...");

const rootElement = document.getElementById('root');

if (rootElement) {
    createRoot(rootElement).render(<App />);
} else {
    console.error("Failed to find the root element");
}


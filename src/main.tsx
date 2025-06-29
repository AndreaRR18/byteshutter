import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variable.css'
import './index.css'
import './styles/global.css'
import App from './App/App'

console.log('main.tsx loaded successfully');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('React app rendered');
} else {
  console.error('Root element not found');
}

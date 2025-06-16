import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import BlogList from './FeedSection/BlogList/BlogList'
import { BlogPost } from './FeedSection/BlogPost/BlogPost'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import { useTheme } from './hooks/useTheme'
import './App.css'

function AppContent() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/articles/:slug" element={<BlogPost />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  // Initialize theme following guidelines
  const { theme } = useTheme();

  useEffect(() => {
    // Apply theme with smooth transitions as per guidelines
    document.documentElement.setAttribute('data-theme', theme);

    // Respect user's system preference by default
    if (!localStorage.getItem('theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, [theme]);

  return (
    <Router basename={import.meta.env.PROD ? "/byteshutter" : ""}>
      <AppContent />
    </Router>
  )
}

export default App

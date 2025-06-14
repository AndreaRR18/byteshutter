import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import BlogList from './FeedSection/BlogList/BlogList'
import { BlogPost } from './FeedSection/BlogPost/BlogPost'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import { useTheme } from './hooks/useTheme'
import './styles/global.css'
import './App.css'

function AppContent() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/articles/:slug" element={<BlogPost />} />
      </Routes>
      <Footer />
    </>
  )
}

function App() {
  // Initialize theme on app start
  const { theme } = useTheme();
  
  useEffect(() => {
    // Ensure theme is applied on initial load
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <Router basename="/byteshutter">
      <AppContent />
    </Router>
  )
}

export default App

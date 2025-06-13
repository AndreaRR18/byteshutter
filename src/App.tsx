import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BlogList from './FeedSection/BlogList/BlogList'
import { BlogPost } from './FeedSection/BlogPost/BlogPost'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import './App.css'

function App() {
  return (
    <Router basename="/byteshutter">
      <Header />
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/articles/:slug" element={<BlogPost />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Feed from './FeedSection/ArticleFeed/Feed'
import { ArticleDetail } from './FeedSection/ArticleDetail/ArticleDetail'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import './App.css'

function App() {
  return (
    <Router basename="/byteshutter">
      <Header />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App

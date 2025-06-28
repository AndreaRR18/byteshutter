import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Landing from "../Landing/Landing";
import BlogList from "../FeedSection/BlogList/BlogList";
import { BlogPost } from "../FeedSection/BlogPost/BlogPost";
import About from "../About/About";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useTheme } from "../hooks/useTheme";
import "./App.css";
import GalleryGrid from "../Gallery/GalleryGrid/GalleryGrid";

function AppContent() {
  return (
    <div className="app min-h-screen bg-background text-text-primary">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/articles" element={<BlogList />} />
          <Route path="/articles/:slug" element={<BlogPost />} />
          <Route path="/gallery" element={<GalleryGrid />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  // Initialize theme using theme hook
  const { theme } = useTheme();

  useEffect(() => {
    // Theme is automatically handled by the useTheme hook
    // Apply theme with smooth transitions
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Use basename only in production
  const basename = import.meta.env.PROD ? "/byteshutter" : "";

  return (
    <Router basename={basename}>
      <AppContent />
    </Router>
  );
}

export default App;

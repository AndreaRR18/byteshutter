import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Landing from "../Landing/Landing";
import BlogList from "../FeedSection/BlogList/BlogList";
import { BlogPost } from "../FeedSection/BlogPost/BlogPost";
import About from "../About/About";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useTheme } from "../hooks/useTheme";
import { ErrorBoundary } from "../components/ErrorBoundary";
import "./App.css";

function AppContent() {
  const location = useLocation();

  // Focus main content on route change for accessibility
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
    }
  }, [location.pathname]);

  return (
    <div className="app min-h-screen bg-background text-text-primary">
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/articles" element={<BlogList />} />
          <Route path="/articles/:slug" element={<BlogPost />} />
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

  // Use different basename for development vs production
  const basename = import.meta.env.PROD ? "/byteshutter" : "";

  return (
    <ErrorBoundary>
      <Router basename={basename}>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;

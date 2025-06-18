import React from 'react';
import './Landing.css';

const Landing: React.FC = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* Hero Section */}
        <div className="landing-hero">
          <h1>AI Coding Agent</h1>
          <div className="landing-subtitle">
            Your Intelligent Development Companion
          </div>
          <p className="landing-description">
            Revolutionize your coding experience with our AI-powered assistant that helps you write, 
            debug, and optimize code faster than ever before.
          </p>
        </div>

        {/* Key Features Section */}
        <div className="landing-section">
          <h2>Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Code Generation</h3>
              <p>Generate high-quality code snippets instantly from natural language descriptions across multiple programming languages.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Debugging</h3>
              <p>Identify and fix syntax errors, logical bugs, and runtime issues with intelligent suggestions and explanations.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Code Optimization</h3>
              <p>Improve performance, readability, and maintainability with automated refactoring and optimization suggestions.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Learning & Documentation</h3>
              <p>Get detailed explanations of complex code and automatically generate comprehensive documentation.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🛠️</div>
              <h3>Project Management</h3>
              <p>Set up new projects with best practices and get suggestions for optimal project structure.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Security Analysis</h3>
              <p>Identify potential security vulnerabilities and get recommendations for secure coding practices.</p>
            </div>
          </div>
        </div>

        {/* Target Audience Section */}
        <div className="landing-section">
          <h2>Built for Every Developer</h2>
          <div className="audience-grid">
            <div className="audience-card">
              <h3>Beginners</h3>
              <p>Learn faster with detailed explanations and tutorials tailored to your skill level.</p>
              <ul>
                <li>Step-by-step guidance</li>
                <li>Code explanations in simple terms</li>
                <li>Interactive learning resources</li>
              </ul>
            </div>
            
            <div className="audience-card">
              <h3>Experienced Developers</h3>
              <p>Boost productivity with advanced optimization and refactoring suggestions.</p>
              <ul>
                <li>Performance optimization</li>
                <li>Architecture recommendations</li>
                <li>Advanced debugging tools</li>
              </ul>
            </div>
            
            <div className="audience-card">
              <h3>Teams & Educators</h3>
              <p>Enhance collaboration and streamline the learning process.</p>
              <ul>
                <li>Code review assistance</li>
                <li>Team collaboration features</li>
                <li>Educational resources</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="landing-section">
          <h2>Cutting-Edge Technology</h2>
          <div className="tech-highlights">
            <div className="tech-item">
              <h3>Natural Language Processing</h3>
              <p>Advanced NLP models understand your intent and generate contextually relevant code.</p>
            </div>
            
            <div className="tech-item">
              <h3>Machine Learning Models</h3>
              <p>Continuously learning from vast codebases to provide increasingly accurate suggestions.</p>
            </div>
            
            <div className="tech-item">
              <h3>Multi-Language Support</h3>
              <p>Support for JavaScript, Python, TypeScript, Java, C++, and many more languages.</p>
            </div>
            
            <div className="tech-item">
              <h3>IDE Integration</h3>
              <p>Seamless integration with popular development environments and tools.</p>
            </div>
          </div>
        </div>

        {/* User Stories Section */}
        <div className="landing-section">
          <h2>Real Developer Stories</h2>
          <div className="stories-container">
            <blockquote className="story-quote">
              "As a beginner developer, the AI coding agent helps me understand complex code snippets 
              in simple terms, making my learning journey much smoother."
              <cite>- Junior Developer</cite>
            </blockquote>
            
            <blockquote className="story-quote">
              "The optimization suggestions have improved my code performance significantly. 
              It's like having a senior developer review my code 24/7."
              <cite>- Senior Engineer</cite>
            </blockquote>
            
            <blockquote className="story-quote">
              "Setting up new projects with best practices is now effortless. 
              My team can start development quickly and efficiently."
              <cite>- Project Manager</cite>
            </blockquote>
          </div>
        </div>

        {/* CTA Section */}
        <div className="landing-section cta-section">
          <h2>Ready to Transform Your Development Experience?</h2>
          <p>Join thousands of developers who are already coding smarter, not harder.</p>
          <div className="cta-buttons">
            <button className="cta-primary">Get Started Free</button>
            <button className="cta-secondary">View Documentation</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 
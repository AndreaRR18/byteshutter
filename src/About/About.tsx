import React from 'react';
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContent}>
        <div className={styles.aboutHeader}>
          <h1>About Me</h1>
          <div className={styles.aboutSubtitle}>
            Developer, Creator, Problem Solver
          </div>
        </div>

        <div className={styles.aboutBody}>
          <div className={styles.aboutSection}>
            <h2>Hello, I'm Andrea!</h2>
            <p>
              Welcome to my digital space where I share my journey through the ever-evolving 
              world of technology and development. I'm a passionate software engineer with a 
              love for creating meaningful digital experiences that make a difference.
            </p>
          </div>

          <div className={styles.aboutSection}>
            <h2>What I Do</h2>
            <p>
              I specialize in full-stack development, with a particular focus on modern web 
              technologies. My toolkit includes React, TypeScript, Node.js, and various cloud 
              platforms. I enjoy tackling complex problems and turning innovative ideas into 
              reality through clean, efficient code.
            </p>
            
            <div className={styles.skillsGrid}>
              <div className={styles.skillCategory}>
                <h3>Frontend</h3>
                <ul>
                  <li>React & Next.js</li>
                  <li>TypeScript</li>
                  <li>CSS & Sass</li>
                  <li>Modern UI Libraries</li>
                </ul>
              </div>
              
              <div className={styles.skillCategory}>
                <h3>Backend</h3>
                <ul>
                  <li>Node.js & Express</li>
                  <li>Python & Django</li>
                  <li>Database Design</li>
                  <li>API Development</li>
                </ul>
              </div>
              
              <div className={styles.skillCategory}>
                <h3>Tools & Platforms</h3>
                <ul>
                  <li>Git & GitHub</li>
                  <li>Docker & Kubernetes</li>
                  <li>AWS & Azure</li>
                  <li>CI/CD Pipelines</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>My Philosophy</h2>
            <blockquote>
              "Great software isn't just about writing code—it's about understanding people, 
              solving real problems, and creating experiences that truly matter."
            </blockquote>
            <p>
              I believe in the power of continuous learning and collaboration. The tech industry 
              moves fast, and I'm always excited to explore new technologies, contribute to 
              open-source projects, and share knowledge with the community.
            </p>
          </div>

          <div className="about-section">
            <h2>Beyond Code</h2>
            <p>
              When I'm not coding, you'll find me exploring photography (hence the name "byteshutter"), 
              reading about emerging technologies, or contributing to tech communities. I'm also 
              passionate about mentoring aspiring developers and helping others navigate their 
              journey in tech.
            </p>
          </div>

          <div className="about-section">
            <h2>Let's Connect</h2>
            <p>
              I'm always open to interesting conversations about technology, collaboration 
              opportunities, or just a friendly chat about the latest trends in development. 
              Feel free to reach out!
            </p>
            
            <div className="contact-links">
              <a href="mailto:hello@byteshutter.dev" className="contact-link">
                <span>Email</span>
              </a>
              <a href="https://github.com/andrea" className="contact-link">
                <span>GitHub</span>
              </a>
              <a href="https://linkedin.com/in/andrea" className="contact-link">
                <span>LinkedIn</span>
              </a>
              <a href="https://twitter.com/andrea" className="contact-link">
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 
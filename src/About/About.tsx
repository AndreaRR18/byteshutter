import React from "react";
import styles from "./About.module.css";
import { getImageUrl } from "../Landing/imageUtils";

const About: React.FC = () => {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContent}>
        <div className={styles.aboutHeader}>
          <h1>Hello, I'm Andrea!</h1>
          <div className={styles.aboutSubtitle}>
            Nice to meet you, and thank you for being interested in who I am.
          </div>
        </div>

        <div className={styles.aboutBody}>
          <div className={styles.aboutSection}>
            <div className={styles.introSection}>
              <div className={styles.introText}>
                <p>
                  If you're curious, I'll give you a brief summary, it won't take
                  long, my story is pretty common to many others :)
                </p>
                <p>
                  <strong>I was born and live in Italy</strong>, a country I adore despite
                  its thousand pros and cons. I was lucky enough to live in Venice
                  for a while - unforgettable!
                </p>
                <p>
                  <strong>I'm a software engineer</strong>, I studied programming (and more)
                  both in high school and university, but in the end I decided
                  that code would accompany me throughout my career, and it
                  continues to do so.
                </p>
              </div>
              <div className={styles.introImage}>
                <img
                  src={getImageUrl("me_thinker.jpg")}
                  alt="Andrea - Tech and Photography"
                  className={styles.profileImage}
                />
              </div>
            </div>
            
            <div className={styles.personalitySection}>
              <p>
                <strong>I'm a videogame enthusiast</strong>, or rather, I was, since my
                kids occupy every other free moment of my day, but I love them
                all the same, I swear! Perhaps that's exactly why I started
                being curious about PCs since I was a child, and yes, I'm old
                enough to remember the sound of the modem when it was turned on.
              </p>
              <p>
                <strong>I have an attraction to stories</strong>, of any kind and told
                through any medium. I'm firmly convinced that this is something
                that can significantly impact our development and is often
                underestimated. I could spend hours listening to grandparents
                telling their stories from when they were young - actually, if
                you have a grandparent you don't hear from often and don't have
                time for, give me their number, I'll gladly keep them company.
              </p>
              <p>
                <strong>I'm also passionate about photography</strong>, especially
                documentary photography, for reasons similar to what I mentioned
                above regarding stories.
              </p>
              <p>
                For now, I think that's all - I don't want to bore you further.
              </p>
              <p>
                If you're curious about where I've worked, you can ask me for a
                connection on{" "}
                <a href="https://www.linkedin.com/in/andrea-rinaldi-707322b7/" className={styles.inlineLink}>
                  LinkedIn
                </a>
                , I'll be happy to accept it.
              </p>
            </div>
          </div>

          <div className={styles.aboutSection}>
            <h2>What I Do</h2>
            <p>
              I started as a mobile developer, and I'm continuing as a mobile
              developer. This is because I'm quite a boring person and also
              because I find this role very satisfying. Working with Swift is a
              pleasure the Apple documentation is well written, the impact of
              the code is immediately visible on screen, you can run complex
              logic in this kind of distributed system, and for many other
              reasons that I'd like to discuss if you ever text me.
            </p>

            <div className={styles.skillsGrid}>
              <div className={styles.skillCategory}>
                <h3>Languages</h3>
                <ul>
                  <li>Swift</li>
                  <li>Kotlin</li>
                </ul>
              </div>

              <div className={styles.skillCategory}>
                <h3>Frameworks</h3>
                <ul>
                  <li>SwiftUI</li>
                  <li>UIKit</li>
                  <li>Jetpack Compose</li>
                </ul>
              </div>

              <div className={styles.skillCategory}>
                <h3>Development Environment</h3>
                <ul>
                  <li>Xcode</li>
                  <li>Android Studio</li>
                </ul>
              </div>

              <div className={styles.skillCategory}>
                <h3>Version Control</h3>
                <ul>
                  <li>Git</li>
                  <li>GitHub</li>
                  <li>GitLab</li>
                </ul>
              </div>

              <div className={styles.skillCategory}>
                <h3>Dependencies</h3>
                <ul>
                  <li>Swift Package Manager</li>
                  <li>Gradle</li>
                  <li>Carthage</li>
                  <li>CocoaPods</li>
                  <li>Maven</li>
                </ul>
              </div>

              <div className={styles.skillCategory}>
                <h3>Networking</h3>
                <ul>
                  <li>URLSession</li>
                  <li>Alamofire</li>
                  <li>Retrofit</li>
                  <li>OkHttp</li>
                </ul>
              </div>

              <div className={styles.skillCategory}>
                <h3>Testing</h3>
                <ul>
                  <li>XCTest</li>
                  <li>JUnit</li>
                  <li>Espresso</li>
                  <li>Mockito</li>
                </ul>
              </div>

              <div className={styles.skillCategory}>
                <h3>Database</h3>
                <ul>
                  <li>Core Data</li>
                  <li>Realm</li>
                  <li>Room</li>
                </ul>
              </div>

              <div className={styles.skillCategory}>
                <h3>Analytics</h3>
                <ul>
                  <li>Sentry</li>
                  <li>Firebase Analytics</li>
                </ul>
              </div>

              <div className={styles.skillCategory}>
                <h3>CI/CD</h3>
                <ul>
                  <li>Xcode Cloud</li>
                  <li>Fastlane</li>
                  <li>GitHub Actions</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.aboutSection}>
            <h2>My Philosophy</h2>
            <blockquote>
              All the best things in my life started with a yes... except when I
              accepted all the changes from a coding agent and spent the next
              hours fixing bugs.
            </blockquote>
            <p>
              Jokes aside, I really like software development; it's full of
              generous people ready to help, something I've never seen in any
              other job. Each software developer has their own experience molded
              by the product they're building, so you can become an expert in
              any field while implementing the details. What more could you want
              from a job!
            </p>
          </div>

          <div className={styles.aboutSection}>
            <h2>Beyond Code</h2>
            <p>
              I have two small kids. I literally do not have time for anything
              else, really. As I said before, I'm quite a boring person, so I
              get up early in the morning to study programming before they get
              up and start their day. After work, I enjoy spending time with
              them, and believe me, it's the best part of the day. I can't ask
              for anything else. Ah, I quite forgot to mention this—I studied
              photography in my free time and do some practice. I've been a
              mentor for a local community of photographers and would love to
              practice more and more. It's like my second big passion!
            </p>
          </div>

          <div className={styles.aboutSection}>
            <h2>Let's Connect</h2>
            <p>
              Congratulations, you arrived here—I wouldn't expect this! If
              you're interested in a comparison, feel free to write to me or
              arrange an online chat; I'd be happy to compare if time allows me.
            </p>

            <div className={styles.contactLinks}>
              <a
                href="mailto:aikido.violin6i@icloud.com"
                className={styles.contactLink}
              >
                <span>📧 Email</span>
              </a>
              <a
                href="https://github.com/AndreaRR18"
                className={styles.contactLink}
              >
                <span>🐙 GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/andrea-rinaldi-707322b7/"
                className={styles.contactLink}
              >
                <span>💼 LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

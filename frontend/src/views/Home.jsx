import React, { useEffect } from 'react'
import '../styles/premium.css'

// Import all components
import Header from '../components/Header'
import Hero from '../components/Hero'
import Destinations from '../components/Destinations'
import PopularTours from '../components/PopularTours'
import About from '../components/About'
import Blog from '../components/Blog'
import Footer from '../components/Footer'
import GoToTop from '../components/GoToTop'

export default function Home() {
  useEffect(() => {
    // Reset any potential body styling issues
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.backgroundColor = '#ffffff'; // Explicitly set white background
    
    // Add padding-top to account for fixed header
    document.body.style.paddingTop = '80px';
    
    return () => {
      // Cleanup on unmount
      document.body.style.paddingTop = '0';
    };
  }, []);

  return (
    <div id="top" style={{ margin: 0, padding: 0 }}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        <article>
          {/* Hero Section */}
          <Hero />

          {/* Destinations Section */}
          <Destinations />

          {/* Popular Tours Section */}
          <PopularTours />

          {/* About Section */}
          <About />

          {/* Blog Section */}
          <Blog />
        </article>
      </main>

      {/* Footer */}
      <Footer />

      {/* Go to Top Button */}
      <GoToTop />
    </div>
  )
}
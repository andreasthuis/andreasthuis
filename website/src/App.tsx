import { useRef, useEffect, useState } from 'react'
import './App.css'

import { useScroll } from 'framer-motion'
import Cubes from './components/Cubes.tsx'
import Hero from './components/Hero.tsx'
import Projects from './components/Projects.tsx'
import Contact from './components/Contact.tsx'
import About from './components/About.tsx'

interface PageConfig {
  id: string
  name: string
  sections: string[]
}

const sectionComponents: { [key: string]: React.ComponentType } = {
  hero: Hero,
  projects: Projects,
  contact: Contact,
  about: About,
}

function App() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  })

  const [pages, setPages] = useState<PageConfig[]>([])
  const [currentPage, setCurrentPage] = useState('home')
  const [loading, setLoading] = useState(true)

  // determine page from URL path
  const updatePageFromPath = () => {
    const path = window.location.pathname.replace(/^\//, '')
    setCurrentPage(path || 'home')
  }

  useEffect(() => {
    const loadPages = async () => {
      try {
        const response = await fetch('/data/pages.json')
        const data = await response.json()
        setPages(data)
      } catch (error) {
        console.error('Failed to load pages:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPages()

    updatePageFromPath()
    window.addEventListener('popstate', updatePageFromPath)
    return () => {
      window.removeEventListener('popstate', updatePageFromPath)
    }
  }, [])

  const currentPageConfig = pages.find(p => p.id === currentPage) || pages.find(p => p.id === 'home')
  const sectionsToRender = currentPageConfig?.sections || []

  return (
    <>
      <Cubes isLocked={false} scrollProgress={scrollYProgress} />
      
      <div className="content" ref={sectionRef}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.7)' }}>
            Loading...
          </div>
        ) : (
          sectionsToRender.map((sectionId) => {
            const Component = sectionComponents[sectionId]
            return Component ? <Component key={sectionId} /> : null
          })
        )}
      </div>

      <footer className="footer">
        <p>&copy; 2026 andreasthuis. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App

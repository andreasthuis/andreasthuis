import { motion } from 'framer-motion'
import './Hero.css'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section className="hero">

      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants}>andreasthuis</motion.h1>
        <motion.p className="subtitle" variants={itemVariants}>
          A teenager that is fascinated by technology and programming
        </motion.p>
        <motion.p className="description" variants={itemVariants}>
          #self-taught &nbsp;&nbsp;&nbsp;&nbsp; #game-dev &nbsp;&nbsp;&nbsp;&nbsp; #web-dev
        </motion.p>
        <motion.div className="cta-buttons" variants={itemVariants}>
          <a href="#projects" className="btn btn-secondary">View My Work</a>
          <a href="#contact" className="btn btn-secondary">Get in Touch</a>
        </motion.div>
      </motion.div>

      <motion.div
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </motion.div>
    </section>
  )
}

import React, { useEffect, useState, useRef } from 'react'
import {
  motion,
  useTransform,
  useVelocity,
  useSpring,
  useAnimationFrame,
  MotionValue
} from 'framer-motion'

/* Types */

type ParticleShape = 'square' | 'plus'

interface Particle {
  id: string
  x: number
  y: number
  size: number
  color: string
  shape: ParticleShape
  duration: number
  delay: number
  opacitySpeed: number
}

interface PixelStarsBackgroundProps {
  isLocked?: boolean
  scrollProgress?: MotionValue<number>
}

/* Particle Generator */

const generateParticles = (
  numParticles: number,
  idPrefix: string
): Particle[] => {
  const items: Particle[] = []
  const colors = ['#0077ff', '#00f7ff', '#444444']
  const shapes: ParticleShape[] = ['square', 'plus']

  for (let i = 0; i < numParticles; i++) {
    items.push({
      id: `${idPrefix}-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      duration: Math.random() * 20 + 20,
      delay: Math.random() * -40,
      opacitySpeed: Math.random() * 2 + 1,
    })
  }

  return items
}

const BASE_PARTICLES = generateParticles(40, 'base')
const EXTRA_PARTICLES = generateParticles(60, 'extra')

/* Cube Generator */
interface Cube {
  id: string
  x: number
  y: number
  size: number
  color: string
  duration: number
  rotations: [number, number, number]
  initialRotations: [number, number, number]
}

const generateCubes = (count: number): Cube[] => {
  const cubes: Cube[] = []
  const colors = ['#0077ff', '#00f7ff', '#646cff', '#ff006e', '#ffd60a']

  const safeRandomPosition = (): { x: number; y: number; size: number } => {
    const size = Math.random() * 2.5 + 2 // 2vw to 4.5vw
    const x = Math.random() * (100 - size)
    const y = Math.random() * (100 - size)
    return { x, y, size }
  }

  const doesOverlap = (a: Cube, b: { x: number; y: number; size: number }) => {
    return (
      Math.abs(a.x - b.x) < (a.size + b.size) &&
      Math.abs(a.y - b.y) < (a.size + b.size)
    )
  }

  let attempts = 0
  const maxAttempts = count * 50

  while (cubes.length < count && attempts < maxAttempts) {
    attempts++
    const { x, y, size } = safeRandomPosition()

    if (cubes.some((c) => doesOverlap(c, { x, y, size }))) continue

    cubes.push({
      id: `cube-${cubes.length}`,
      x,
      y,
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 30 + 30,
      // always rotate a full revolution (±360°) to avoid jumps when the animation loops
      rotations: [
        (Math.random() < 0.5 ? -1 : 1) * 360,
        (Math.random() < 0.5 ? -1 : 1) * 360,
        (Math.random() < 0.5 ? -1 : 1) * 360,
      ] as [number, number, number],
      initialRotations: [
        Math.random() * 360,
        Math.random() * 360,
        Math.random() * 360,
      ] as [number, number, number],
    })
  }

  return cubes
}

const GENERATED_CUBES = generateCubes(12)

/* Component */

const PixelStarsBackground: React.FC<PixelStarsBackgroundProps> = ({
  isLocked = false,
  scrollProgress
}) => {
  const [, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1000,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [baseParticles] = useState<Particle[]>(BASE_PARTICLES)
  const [extraParticles] = useState<Particle[]>(EXTRA_PARTICLES)
  const [cubes] = useState<Cube[]>(GENERATED_CUBES)

  /* Scroll Safety */

  const safeScroll: MotionValue<number> =
    scrollProgress ??
    ({
      get: () => 0,
      set: () => {},
      onChange: () => () => {},
    } as unknown as MotionValue<number>)

  const extraStarOpacity = useTransform(safeScroll, [0, 0.1], [0, 1])

  const scrollVelocity = useVelocity(safeScroll)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })

  const velocityFactor = useTransform(
    smoothVelocity,
    [0, 1000],
    [0, 5],
    { clamp: false }
  )

  const yRef = useRef<number>(0)
  const [dynamicY, setDynamicY] = useState<number>(0)

  useAnimationFrame((_, delta) => {
    if (!isLocked) {
      const speed = 0.05 + Math.abs(velocityFactor.get() * 5)

      yRef.current -= speed * (delta / 16)

      if (yRef.current <= -100) {
        yRef.current = 0
      }

      setDynamicY(yRef.current)
    }
  })

  /* Particle Renderer */

  const renderParticle = (p: Particle) => (
    <motion.div
      key={p.id}
      style={{
        position: 'absolute',
        left: `${p.x}%`,
        width: p.shape === 'square' ? p.size : 'auto',
        height: p.shape === 'square' ? p.size : 'auto',
        backgroundColor:
          p.shape === 'square' ? p.color : 'transparent',
        color: p.color,
        fontSize: `${p.size * 2}px`,
        fontFamily: 'var(--font-mono)',
        fontWeight: 'bold',
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.15,
      }}
      initial={{ y: `${p.y}vh` }}
      animate={{
        y: [`${p.y}vh`, '-10vh'],
        opacity: [0.15, 0.5, 0.15],
      }}
      transition={{
        y: {
          duration: p.duration,
          repeat: Infinity,
          ease: 'linear',
          delay: p.delay,
        },
        opacity: {
          duration: p.opacitySpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      {p.shape === 'plus' ? '+' : ''}
    </motion.div>
  )

  /* Render */

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Base Stars */}
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {baseParticles.map(renderParticle)}
      </div>

      {/* Scroll-reactive Stars */}
      <motion.div
        style={{
          position: 'absolute',
          width: '100%',
          height: '200%',
          opacity: extraStarOpacity,
          y: `${dynamicY}vh`,
        }}
      >
        {extraParticles.map(renderParticle)}

        <div
          style={{
            position: 'absolute',
            top: '100%',
            width: '100%',
            height: '100%',
          }}
        >
          {extraParticles.map(renderParticle)}
        </div>
      </motion.div>

      {/* Dynamic 3D Cubes */}
      {cubes.map((cube) => (
        <div
          key={cube.id}
          style={{
            position: 'absolute',
            left: `${cube.x}%`,
            top: `${cube.y}%`,
            width: `${cube.size}vw`,
            height: `${cube.size}vw`,
            perspective: '800px',
            minWidth: '2vw',
            minHeight: '2vw',
          }}
        >
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotateX: [cube.initialRotations[0], cube.initialRotations[0] + cube.rotations[0]],
              rotateY: [cube.initialRotations[1], cube.initialRotations[1] + cube.rotations[1]],
              rotateZ: [cube.initialRotations[2], cube.initialRotations[2] + cube.rotations[2]],
            }}
            transition={{ duration: cube.duration, repeat: Infinity, ease: 'linear' }}
          >
            {[
              { transform: `translateZ(${cube.size / 2}vw)` },
              { transform: `rotateY(180deg) translateZ(${cube.size / 2}vw)` },
              { transform: `rotateY(90deg) translateZ(${cube.size / 2}vw)` },
              { transform: `rotateY(-90deg) translateZ(${cube.size / 2}vw)` },
              { transform: `rotateX(90deg) translateZ(${cube.size / 2}vw)` },
              { transform: `rotateX(-90deg) translateZ(${cube.size / 2}vw)` },
            ].map((faceStyle, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  border: `1px solid ${cube.color}`,
                  backgroundColor: `${cube.color}15`,
                  ...faceStyle,
                }}
              />
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  )
}

export default PixelStarsBackground
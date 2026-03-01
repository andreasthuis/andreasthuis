import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import FloatingShapes from './FloatingShapes'
import './Scene.css'

interface SceneProps {
  variant?: 'hero' | 'default'
}

export default function Scene({ variant = 'default' }: SceneProps) {
  return (
    <div className="scene-container">
      <Canvas
        className="canvas"
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <FloatingShapes variant={variant} />
        </Suspense>
      </Canvas>
    </div>
  )
}

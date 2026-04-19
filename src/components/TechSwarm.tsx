import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function ParticleField() {
  const ref = useRef<THREE.Points>(null!)
  const [positions] = useMemo(() => {
    const pos = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return [pos]
  }, [])

  useFrame((_state, delta) => {
    ref.current.rotation.x -= delta / 10
    ref.current.rotation.y -= delta / 15
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#3DDC84" size={0.15} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  )
}

function SceneContent() {
  const groupRef = useRef<THREE.Group>(null!)
  
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#career",
        start: "top bottom",
        endTrigger: "#techstack",
        end: "bottom bottom",
        scrub: 1,
      }
    })

    tl.fromTo(groupRef.current.position, { z: -20, y: 10 }, { z: 0, y: 0, duration: 1 })
    tl.fromTo(groupRef.current.rotation, { y: Math.PI }, { y: 0, duration: 1 }, 0)

    return () => {
      tl.kill();
    }
  }, [])

  return (
    <group ref={groupRef}>
      <ParticleField />
      {/* Logos/Cubes removed for now as requested */}
    </group>
  )
}

export default function TechSwarm() {
  return (
    <div className="fixed inset-0 z-[5] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 35 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}

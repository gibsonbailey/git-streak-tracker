import * as THREE from 'three'
import { useRef, forwardRef, PropsWithChildren } from 'react'
import { Canvas, useFrame, ThreeElements, extend } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

extend({ EffectComposer, Bloom })

const Circle = forwardRef<THREE.Mesh>(
  (
    {
      children,
      opacity = 1,
      radius = 0.05,
      segments = 32,
      color = '#ff1050',
      ...props
    }: PropsWithChildren<
      {
        opacity: number | undefined
        radius: number | undefined
        segments: number | undefined
        color: string | undefined
      } & ThreeElements['mesh']
    >,
    ref,
  ) => (
    <mesh ref={ref} {...props}>
      <circleGeometry args={[radius, segments]} />
      <meshBasicMaterial
        // transparent={opacity < 1}
        transparent={true}
        opacity={opacity}
        color={color}
      />
      {children}
    </mesh>
  ),
)

function hslToHex(h, s, l) {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0') // convert to Hex and prefix "0" if needed
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

const generateInitialVelocity = () => {
  const speed = 0.05
  return [
    Math.random() * -speed,
    (Math.random() - 0.5) * speed * 2,
    Math.random() * speed,
  ]
}

const generateParticle = () => {
  // HSL bounds
  // h: 92, 129
  // s: 0%, 100%
  // l: 29%, 50%

  const hue = 92 + Math.random() * (129 - 92)
  const saturation = 60 + Math.random() * (100 - 60)
  const lightness = 30 + Math.random() * (50 - 30)

  return {
    velocity: generateInitialVelocity(),
    radius: Math.random() * 0.01,
    color: hslToHex(hue, saturation, lightness),
    opacity: 1,
  }
}

const Particles = () => {
  const particleQuantity = 1000
  const gravity = -0.002
  const xDampening = 1 - 0.01
  const floorHeight = -3

  const groupRef = useRef<THREE.Group>()
  const particleShown = useRef<number>(0)
  const particles = useRef(
    Array.from({ length: particleQuantity }, generateParticle),
  )

  useFrame(() => {
    if (groupRef.current) {
      if (particleShown.current < particleQuantity) {
        particleShown.current += 5
      }
      groupRef.current.children.forEach((particle, index) => {
        // Gradually introduce particles
        if (index > particleShown.current) {
          return
        }

        // Reset particle to origin
        if (particle.material.opacity < 0.1) {
          particles.current[index].velocity = generateInitialVelocity()
          particle.position.x = 0
          particle.position.y = 0
          // particle.material.opacity = 0.7 * (Math.random() * 0.3)
          particle.material.opacity = 1
        }

        // Bounce off of the floor
        if (particle.position.y < floorHeight) {
          particles.current[index].velocity[1] = Math.abs(
            particles.current[index].velocity[1] * 0.4,
          )
          particles.current[index].velocity[0] *= 0.5
        }

        particles.current[index].velocity[0] *= xDampening
        particles.current[index].velocity[1] += gravity
        particle.position.x += particles.current[index].velocity[0]
        particle.position.y += particles.current[index].velocity[1]
        particle.material.opacity *= 0.97
      })
    }
  })

  return (
    <group ref={groupRef}>
      {particles.current.map((particle, index) => (
        <Circle
          key={index}
          radius={particle.radius}
          color={particle.color}
          opacity={particle.opacity}
          segments={32}
        />
      ))}
    </group>
  )
}

export default () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Particles />
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </Canvas>
  )
}

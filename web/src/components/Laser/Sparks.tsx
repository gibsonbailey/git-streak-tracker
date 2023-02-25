import * as THREE from 'three'
import {
  useRef,
  forwardRef,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import {
  Canvas,
  useFrame,
  ThreeElements,
  extend,
  useThree,
} from '@react-three/fiber'
import { EffectComposer, Bloom, GodRays } from '@react-three/postprocessing'

extend({ EffectComposer, Bloom, GodRays })

const Circle = forwardRef<THREE.Mesh>(
  (
    {
      children,
      emissiveIntentisy = 1,
      radius = 0.05,
      segments = 32,
      color = '#ff1050',
      ...props
    }: PropsWithChildren<
      {
        emissiveIntentisy: number | undefined
        radius: number | undefined
        segments: number | undefined
        color: string | undefined
      } & ThreeElements['mesh']
    >,
    ref,
  ) => (
    <mesh ref={ref} {...props}>
      <circleGeometry args={[radius, segments]} />
      <meshPhongMaterial
        color={'#ff0000'}
        emissive={'#f2ff00'}
        emissiveIntensity={emissiveIntentisy}
        transparent
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

const gravity = -0.002
const xDampening = 1 - 0.01
const yDampening = 1 - 0.008
const speed = 0.12

const generateInitialVelocity = () => {
  return [
    Math.random() * -speed,
    (Math.random() - 0.5) * speed * 2,
    Math.random() * speed,
  ]
}

const lerp = (a, b, n) => {
  // Params:
  // a: start value
  // b: end value
  // n: interpolation value between 0 and 1
  return (1 - n) * a + n * b
}

const generateParticle = (
  initialXPosition: number,
  initialYPosition: number,
) => {
  // HSL bounds for green particles
  // h: 92, 129
  // s: 0%, 100%
  // l: 29%, 50%

  // const hue = 92 + Math.random() * (129 - 92)
  // const saturation = 60 + Math.random() * (100 - 60)
  // const lightness = 45 + Math.random() * (50 - 45)

  // HSL bounds for red-yellow particles
  // h: 0, 55
  // s: 0%, 100%
  // l: 29%, 50%

  const hue = 0 + Math.random() * (55 - 0)
  const saturation = 60 + Math.random() * (100 - 60)
  const lightness = 45 + Math.random() * (50 - 45)

  return {
    velocity: generateInitialVelocity(),
    radius: lerp(0.004, 0.008, Math.random()),
    color: hslToHex(hue, saturation, lightness),
    emissiveIntensity: 0,
    position: {
      x: initialXPosition,
      y: initialYPosition,
    },
  }
}

const Particles = forwardRef(
  (
    {
      xOriginPosition,
      iPhoneFrameRef,
      TerminalFrameRef,
    }: {
      xOriginPosition: number
      iPhoneFrameRef: React.RefObject<HTMLDivElement>
      TerminalFrameRef: React.RefObject<HTMLDivElement>
    },
    controlRef,
  ) => {
    const particleQuantity = 200
    const floorHeight = -3.5

    const { camera } = useThree()

    const [initialXPosition, setInitialXPosition] = useState(0)
    const initialYPosition = 0

    useEffect(() => {
      var vFOV = THREE.MathUtils.degToRad(camera.fov)
      var height = 2 * Math.tan(vFOV / 2) * camera.position.z // visible height
      var worldWidth = height * camera.aspect
      let x = worldWidth * (xOriginPosition - 0.5)
      setInitialXPosition(x)
      particles.current = Array.from({ length: particleQuantity }, () =>
        generateParticle(initialXPosition, initialYPosition),
      )
    }, [xOriginPosition])

    const groupRef = useRef<THREE.Group>()
    const particleShown = useRef<number>(0)
    const particles = useRef(
      Array.from({ length: particleQuantity }, () =>
        generateParticle(initialXPosition, initialYPosition),
      ),
    )

    useFrame(() => {
      if (controlRef.current === 'stop') {
        return
      }
      if (groupRef.current) {
        if (particleShown.current < particleQuantity) {
          particleShown.current += 10
        }
        groupRef.current.children.forEach((particle, index) => {
          // Gradually introduce particles
          if (index > particleShown.current) {
            return
          }

          const vFOV = THREE.MathUtils.degToRad(camera.fov)
          const height = 2 * Math.tan(vFOV / 2) * camera.position.z // visible height at the z=0 plane
          const worldWidth = height * camera.aspect

          // Reset particle to origin
          if (
            particle.material.emissiveIntensity < 0.1 &&
            controlRef.current !== 'finish'
          ) {
            particles.current[index].velocity = generateInitialVelocity()

            if (iPhoneFrameRef.current) {
              particles.current[index].position.x =
                (iPhoneFrameRef.current.getBoundingClientRect().x /
                  window.innerWidth -
                  0.5) *
                worldWidth
            }
            particles.current[index].position.y = initialYPosition
            particle.material.emissiveIntensity = 1
            particle.material.opacity = 1
          }

          // Apply forces
          particles.current[index].velocity[0] *= xDampening
          particles.current[index].velocity[1] *= yDampening
          particles.current[index].velocity[1] += gravity

          // integrate velocity
          particles.current[index].position.x +=
            particles.current[index].velocity[0]
          particles.current[index].position.y +=
            particles.current[index].velocity[1]

          // Bounce off of the left wall
          // This has to happen after the position is updated by velocity because otherwise the particle's position
          // could be past the wall.
          let wallX = null
          if (TerminalFrameRef.current) {
            wallX =
              ((TerminalFrameRef.current.getBoundingClientRect().x +
                TerminalFrameRef.current.offsetWidth) /
                window.innerWidth -
                0.5) *
              worldWidth
          }
          if (wallX != null) {
            if (
              particles.current[index].position.x < wallX &&
              particles.current[index].position.y < 1.6 && // Top of terminal
              particles.current[index].position.y > -1.25 // Bottom of terminal
            ) {
              particles.current[index].velocity[0] = Math.abs(
                particles.current[index].velocity[0] * 0.3,
              )
              particles.current[index].position.x = wallX
              particles.current[index].velocity[1] *= 0.2

              particle.material.emissiveIntensity *= 0.4
              particle.material.opacity *= 0.4
            }
          }

          // Bounce off of the iPhone frame
          let phoneWallX = null
          if (iPhoneFrameRef.current) {
            phoneWallX =
              (iPhoneFrameRef.current.getBoundingClientRect().x /
                window.innerWidth -
                0.5) *
              worldWidth
          }
          if (phoneWallX != null) {
            if (
              particles.current[index].position.x > phoneWallX &&
              particles.current[index].position.y < 1.6 && // Top of phone
              particles.current[index].position.y > -1.25 // Bottom of phone
            ) {
              particles.current[index].velocity[0] =
                0 - Math.abs(particles.current[index].velocity[0] * 0.3)
              particles.current[index].position.x = phoneWallX
              particles.current[index].velocity[1] *= 0.2
            }
          }

          // Bounce off of the floor
          if (particles.current[index].position.y < floorHeight) {
            particles.current[index].velocity[1] = Math.abs(
              particles.current[index].velocity[1] * 0.1,
            )
            particles.current[index].position.y = floorHeight
            particles.current[index].velocity[0] *= 0.8

            particle.material.emissiveIntensity *= 0.4
            particle.material.opacity *= 0.95
          }

          const xVel = particles.current[index].velocity[0]
          const yVel = particles.current[index].velocity[1]
          const vel = Math.sqrt(xVel * xVel + yVel * yVel)

          particle.scale.set(1 + vel * vel * 1000, 1, 1)
          particle.rotation.set(0, 0, Math.atan2(yVel, xVel))

          // Assign new positions
          particle.position.x = particles.current[index].position.x
          particle.position.y = particles.current[index].position.y

          // Gradually dim particles
          particle.material.emissiveIntensity *= 0.95
          particle.material.opacity *= 0.995
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
            emissiveIntensity={particle.emissiveIntensity}
            segments={8}
          />
        ))}
      </group>
    )
  },
)

export default forwardRef(
  (
    {
      sparksXPosition,
      iPhoneFrameRef,
      TerminalFrameRef,
    }: {
      sparksXPosition: number
      iPhoneFrameRef: React.RefObject<HTMLDivElement>
      TerminalFrameRef: React.RefObject<HTMLDivElement>
    },
    ref,
  ) => {
    const [widthPortion, setWidthPortion] = useState(0.5)

    useEffect(() => {
      setWidthPortion(sparksXPosition / window.innerWidth)
    }, [sparksXPosition])

    return (
      <div className="h-full w-full absolute z-50">
        <Canvas className="h-full w-full">
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[3, 0, 2]} intensity={2} />
          <Particles
            ref={ref}
            xOriginPosition={widthPortion}
            iPhoneFrameRef={iPhoneFrameRef}
            TerminalFrameRef={TerminalFrameRef}
          />
          <EffectComposer>
            <Bloom
              luminanceThreshold={0}
              luminanceSmoothing={0.9}
              height={300}
            />
          </EffectComposer>
        </Canvas>
      </div>
    )
  },
)

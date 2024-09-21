import * as THREE from 'three'
import { useRef, useReducer, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Text } from '@react-three/drei'  // Added Text
import { BallCollider, Physics, RigidBody } from '@react-three/rapier'
import { easing } from 'maath'
import { Effect } from './Effect'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'


const accents = ['#ff4060', '#ffcc00', '#20ffa0', '#4060ff']
const shuffle = (accent = 0) => [
  { color: '#444', roughness: 0.1, metalness: 0.5 },
  { color: '#444', roughness: 0.1, metalness: 0.5 },
  { color: '#444', roughness: 0.1, metalness: 0.5 },
  { color: 'white', roughness: 0.1, metalness: 0.1 },
  { color: 'white', roughness: 0.1, metalness: 0.1 },
  { color: 'white', roughness: 0.1, metalness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: '#444', roughness: 0.1 },
  { color: '#444', roughness: 0.3 },
  { color: '#444', roughness: 0.3 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.2 },
  { color: 'white', roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true, transparent: true, opacity: 0.5 },
  { color: accents[accent], roughness: 0.3, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true }
]


export default function Ballons(props) {
  
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTransitioning(true);
    setTimeout(() => {
      navigate('/next-page2'); // Navigate to the next page after zoom
    }, 9000); // 2 seconds t
  }, [])
  
  const [accent, click] = useReducer((state) => ++state % accents.length, 0)
  const connectors = useMemo(() => shuffle(accent), [accent])
  return (
    <motion.div animate={transitioning ? { scale: 2 } : { scale: 1 }} // Zoom-in effect
    transition={{ duration: 2 }}>
    <Canvas flat shadows style={{height:'100vh'}} onClick={click} dpr={[1, 1.5]} gl={{ antialias: false }} camera={{ position: [0, 0, 30], fov: 17.5, near: 10, far: 40 }} {...props}>
      <color attach="background" args={['#141622']} />

      <Text
        position={[0, 0, -10]} // Position in the background
        fontSize={.2}            // Adjust font size
        color="white"           // Color of the text
        anchorX="center"        // Align the text center horizontally
        anchorY="middle"        // Align the text center vertically
      >
        Happy Birthday Mehak
      </Text>
      
      <Physics /*debug*/ timeStep="vary" gravity={[0, 0, 0]}>
        <Pointer />
        {connectors.map((props, i) => (
          <Sphere key={i} {...props} />
        ))}
      </Physics>
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={100} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
          <Lightformer form="ring" color="#4060ff" intensity={80} onUpdate={(self) => self.lookAt(0, 0, 0)} position={[10, 10, 0]} scale={10} />
        </group>
      </Environment>
      <Effect />
    </Canvas>
    
    </motion.div>
  )
}

function Sphere({ position, children, vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, accent, color = 'white', ...props }) {
  const api = useRef()
  const ref = useRef()
  const pos = useMemo(() => position || [r(10), r(10), r(10)], [])

  // Modify to scatter balloons away from the center
  useFrame((state, delta) => {
    delta = Math.min(0.1, delta)
    api.current?.applyImpulse(vec.randomDirection().multiplyScalar(0.1)) // Make them scatter in random directions
    easing.dampC(ref.current.material.color, color, 0.2, delta)
  })

  return (
    <RigidBody linearDamping={4} angularDamping={1} friction={0.1} position={pos} ref={api} colliders={false}>
      <BallCollider args={[1]} />
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial {...props} />
        {children}
        <Text // Adding "Tap" text on each balloon
          position={[0, 0, 1.1]} // Slightly in front of the balloon
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Tap
        </Text>
      </mesh>
    </RigidBody>
  )
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef()
  useFrame(({ mouse, viewport }) => ref.current?.setNextKinematicTranslation(vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0)))
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  )
}

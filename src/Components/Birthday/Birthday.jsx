import { TextureLoader, Vector3 } from 'three'
import { useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useGLTF, SpotLight, useDepthBuffer, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import Rose from '../Rose'


export default function Birthday() {
  const backgroundTexture = useLoader(TextureLoader, '../public/bgtex.jpg');
  return (
    <>
    <Canvas shadows dpr={[1, 2]} camera={{ position: [-2, 2, 6], fov: 50, near: 1, far: 20 }}>
      <color attach="background" args={['#202020']} />
      {/* <primitive attach="background" object={backgroundTexture} />  */}
      <fog attach="fog" args={['#202020', 5, 20]} />
      <ambientLight intensity={0.015} />
      <Scene />
    </Canvas>
      
    <motion.div initial={{opacity:0,y:-100}} animate={{opacity:1,y:0}} transition={{duration:2}} className='fixed md:leading-10 md:left-[30%] bottom-80 text-xl text-white left-5 md:bg-transparent md:text-4xl p-1 rounded-2xl '>
      <p><b>Happy Birthday</b>, <br /> On this auspicious day I want to let you know , <br /> You are very special. <br /> You are so kind, humble and helpful <br /> You are the best of yourself.<br /> <b>Happy Birthday</b></p>
      {/* <button className=' rounded font-bold'><a href='/gift' className='hover:text-white'>Gift</a></button> */}
    </motion.div>


    </>
  )
}

function Scene() {
  // This is a super cheap depth buffer that only renders once (frames: 1 is optional!), which works well for static scenes
  // Spots can optionally use that for realism, learn about soft particles here: http://john-chapman-graphics.blogspot.com/2013/01/good-enough-volumetrics-for-spotlights.html
  const depthBuffer = useDepthBuffer({ frames: 1 })
  const { nodes, materials } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/dragon/model.gltf')
  return (
    <>
      <MovingSpot depthBuffer={depthBuffer} color="#0c8cbf" position={[3, 3, 2]} />
      <MovingSpot depthBuffer={depthBuffer} color="#b00c3f" position={[1, 3, 0]} />
      <MovingSpot depthBuffer={depthBuffer} color="#ED3EF7" position={[-2, 3, 2]} />
      <MovingSpot depthBuffer={depthBuffer} color="#AD49E1" position={[-4, 3, 0]} />
      {/* <mesh position={[0, -1.03, 0]} castShadow receiveShadow geometry={nodes.dragon.geometry} material={materials['Default OBJ.001']} dispose={null} />
      <mesh receiveShadow position={[0, -1, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[50, 50]} />
        <meshPhongMaterial />
      </mesh> */}

    </>
  )
}

function MovingSpot({ vec = new Vector3(), ...props }) {
  const light = useRef()
  const viewport = useThree((state) => state.viewport)
  useFrame((state) => {
    light.current.target.position.lerp(vec.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0), 0.1)
    light.current.target.updateMatrixWorld()
  })
  return <SpotLight castShadow ref={light} penumbra={1} distance={6} angle={0.35} attenuation={5} anglePower={4} intensity={2} {...props} />
}

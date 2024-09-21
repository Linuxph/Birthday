import { Canvas,useFrame } from '@react-three/fiber'
import { useGLTF, MeshReflectorMaterial, BakeShadows } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import { easing } from 'maath'
import { suspend } from 'suspend-react'
import { Instances, Computers } from './Computers'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Ballons from './Components/Ballons'
import Birthday from './Components/Birthday/Birthday'
import Rose from './Components/Rose'

const suzi = import('@pmndrs/assets/models/bunny.glb')

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/next-page" element={<Ballons />} />
        <Route path="/next-page2" element={<Birthday />} />

      </Routes>
    </Router>
  )
}

function MainApp() {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);

  const handleTransition = () => {
    setTransitioning(true);
    setTimeout(() => {
      navigate('/next-page'); // Navigate to the next page after zoom
    }, 2000); // 2 seconds transition
  };

  return (
    <motion.div 
      animate={transitioning ? { scale: 2 } : { scale: 1 }} // Zoom-in effect
      transition={{ duration: 2 }}
    >
      <Canvas style={{height:'100vh'}} shadows dpr={[1, 1.5]} camera={{ position: [-1.5, 1, 5.5], fov: 45, near: 1, far: 20 }} eventSource={document.getElementById('root')} eventPrefix="client">
      {/* Lights */}
      <color attach="background" args={['black']} />
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight decay={0} position={[10, 20, 10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
      {/* Main scene */}
      <group position={[-0, -1, 0]}>
        {/* Auto-instanced sketchfab model */}
        <Instances>
          <Computers scale={0.5} />
        </Instances>
        {/* Plane reflections + distance blur */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 30]}
            resolution={2048}
            mixBlur={1}
            mixStrength={180}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#202020"
            metalness={0.8}
          />
        </mesh>
        {/* Bunny and a light give it more realism */}
        <Bun scale={0.4} position={[0, 0.3, 0.5]} rotation={[0, -Math.PI * 0.85, 0]} />
        <pointLight distance={1.5} intensity={1} position={[-0.15, 0.7, 0]} color="orange" />
      </group>
      {/* Postprocessing */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={5} />
        <DepthOfField target={[0, 0, 13]} focalLength={0.3} bokehScale={15} height={700} />
      </EffectComposer>
      {/* Camera movements */}
      <CameraRig />
      {/* Small helper that freezes the shadows for better performance */}
      <BakeShadows />
    </Canvas>

      {/* Button to trigger the transition */}
      <motion.button
        className="fixed bottom-5 left-5 bg-black text-white px-4 py-2 rounded"
        onClick={handleTransition}
        whileHover={{ scale: 1.1 }}
      >
        Go to Next Page
      </motion.button>
    </motion.div>
  )
}

function Bun(props) {
  const { nodes } = useGLTF(suspend(suzi).default)
  console.log(nodes)
  return (
    <mesh receiveShadow castShadow geometry={nodes.mesh.geometry} {...props}>
      <meshStandardMaterial color="#222" roughness={0.5} />
    </mesh>
  )
}

function CameraRig() {
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [-1 + (state.pointer.x * state.viewport.width) / 3, (1 + state.pointer.y) / 2, 5.5], 0.5, delta)
    state.camera.lookAt(0, 0, 0)
  })
}


function DummyPage() {
  return (
    <motion.div 
      className="h-screen flex items-center justify-center bg-gray-800 text-white"
      initial={{ scale: 0.5, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }} 
      transition={{ duration: 1.5 }}
    >
      <h1 className="text-4xl">Welcome to the Dummy Page!</h1>
      <Link to="/" className="text-wh mt-4">Go back</Link>
    </motion.div>
  )
}



// import React from 'react';
// import { Canvas,useFrame } from '@react-three/fiber';
// import { OrbitControls, Plane, useGLTF } from '@react-three/drei';
// import {motion} from 'framer-motion'
// function CakeModel(props) {

//   const myMesh = React.useRef();

//   useFrame(({ clock }) => {
//     const a = clock.getElapsedTime();
//     myMesh.current.rotation.y = a;
//   });

//   const { nodes, materials } = useGLTF('/cake.gltf');
//   return (
//     <group {...props} dispose={null} ref={myMesh} >
//       {/* Ribbon */}
//       <mesh 
      
//       castShadow
//         geometry={nodes.ribbon.geometry} 
//         material={materials.Adornos} 
//         position={[0, 92.044, 0]} 
//         rotation={[-Math.PI / 2, 0, -1.266]} 
//         scale={100} 
//       />
//       {/* Balls */}
//       <mesh 
//       castShadow
//         geometry={nodes.balls.geometry} 
//         material={materials.FondantAzul} 
//         position={[0, 46.361, 0]} 
//         rotation={[-Math.PI / 2, 0, 0]} 
//         scale={100} 
//       />
//       {/* Base */}
//       <mesh 
//       castShadow
//         geometry={nodes.base.geometry} 
//         material={materials.Base} 
//         rotation={[-Math.PI / 2, 0, 0]} 
//         scale={[121.898, 121.898, 7.828]} 
//       />
//       {/* Body */}
//       <mesh 
//       castShadow
//         geometry={nodes.body.geometry} 
//         material={materials['FondantAzul.001']} 
//         position={[0, 41.881, 0]} 
//         rotation={[-Math.PI / 2, 0, 0]} 
//         scale={[100, 100, 81.543]} 
//       />
//       {/* Group for decorative cylinders */}
//       <group 
//         position={[-71.553, 87.306, -37.907]} 
//         rotation={[-0.748, 0.962, 0.651]} 
//         scale={106.361}
//       >
//         <mesh castShadow geometry={nodes.Cylinder016.geometry} material={materials['Adornos.013']} />
//         <mesh castShadow geometry={nodes.Cylinder016_1.geometry} material={materials['Adornos.001']} />
//         <mesh castShadow geometry={nodes.Cylinder016_2.geometry} material={materials['Adornos.002']} />
//         <mesh castShadow geometry={nodes.Cylinder016_3.geometry} material={materials['Adornos.003']} />
//         <mesh castShadow geometry={nodes.Cylinder016_4.geometry} material={materials['Adornos.004']} />
//         <mesh castShadow geometry={nodes.Cylinder016_5.geometry} material={materials['Adornos.005']} />
//         <mesh castShadow geometry={nodes.Cylinder016_6.geometry} material={materials['Adornos.006']} />
//         <mesh castShadow geometry={nodes.Cylinder016_7.geometry} material={materials['Adornos.007']} />
//         <mesh castShadow geometry={nodes.Cylinder016_8.geometry} material={materials['Adornos.008']} />
//         <mesh castShadow geometry={nodes.Cylinder016_9.geometry} material={materials['Adornos.009']} />
//         <mesh castShadow geometry={nodes.Cylinder016_10.geometry} material={materials['Adornos.010']} />
//         <mesh castShadow geometry={nodes.Cylinder016_11.geometry} material={materials['Adornos.011']} />
//         <mesh castShadow geometry={nodes.Cylinder016_12.geometry} material={materials['Adornos.012']} />
//         <mesh castShadow geometry={nodes.Cylinder016_13.geometry} material={materials['Adornos.014']} />
//         <mesh castShadow geometry={nodes.Cylinder016_14.geometry} material={materials['Adornos.015']} />
//         <mesh castShadow geometry={nodes.Cylinder016_15.geometry} material={materials['Adornos.016']} />
//       </group>
//     </group>
//   );
// }

// useGLTF.preload('/cake.gltf');

// function Scene() {
//   return (
//     <Canvas
//       camera={{ position: [0, 100, 200], fov: 150 }} // FOV set to 50, and camera position
//       style={{ height: '100vh', width: '100%' }} // Full-screen canvas
//       shadows
//     >
//       {/* Lighting */}
//       <ambientLight intensity={1} />
//       <directionalLight position={[7, 7, 7]} intensity={3} />
//       <spotLight position={[0, 300, 200]} angle={0.3} intensity={2} />

//       {/* Cake Model */}
//       <CakeModel position={[0, 0, 0]} />
//       <Plane />

//       {/* Orbit Controls for camera rotation */}
//       <OrbitControls enableZoom={true} />
//     </Canvas>
//   );
// }

// export default function App() {
//   return (
//     <motion.div className='bg-blue-400 opacity-0' animate={{opacity:1}} transition={{duration:3}} >
//       <motion.div className=' w-1/2 h-1/2 ' animate={{x:200}} transition={{duration:3.5}}>
//       {/* <h1>Happy Birthday </h1> */}
//         <Scene />
//       </motion.div>
//     </motion.div>
//   );
// }


// // import { TextureLoader } from 'three/src/loaders/TextureLoader'
// // import { Canvas, useLoader } from '@react-three/fiber'
// // import { Box, Cylinder, OrbitControls } from '@react-three/drei'
// // import { Suspense } from 'react'
// // const App = () => {
// //   const colorMap = useLoader(TextureLoader, 'kristiana-pinne-XwEqexuHAoY-unsplash.jpg')

// //   return (
// //     <>
// //     <Canvas
// //      camera={{ position: [0, 100, 200], fov: 50 }} 
// //      style={{ height: '100vh', width: '100%' }} 
// //     >
// //       <Suspense fallback={null}>
// //        <ambientLight />
// //        <pointLight position={[10, 10, 10]} />
// //       <OrbitControls/>
// //       <Cylinder >
// //         <meshStandardMaterial map={colorMap} />
// //       </Cylinder>
// //       </Suspense>
// //     </Canvas>
// //     </>
// //   )
// // }

// // export default App
  
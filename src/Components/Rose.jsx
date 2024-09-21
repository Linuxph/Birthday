import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Model } from '../../public/rose/Scene';

export default function RoseModel() {
  

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Model />
      <OrbitControls /> {/* To allow orbiting around the model */}
    </Canvas>
  );
}





import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/cake.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.ribbon.geometry} material={materials.Adornos} position={[0, 92.044, 0]} rotation={[-Math.PI / 2, 0, -1.266]} scale={100} />
      <mesh geometry={nodes.balls.geometry} material={materials.FondantAzul} position={[0, 46.361, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      <mesh geometry={nodes.base.geometry} material={materials.Base} rotation={[-Math.PI / 2, 0, 0]} scale={[121.898, 121.898, 7.828]} />
      <mesh geometry={nodes.body.geometry} material={materials['FondantAzul.001']} position={[0, 41.881, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 81.543]} />
      <group position={[-71.553, 87.306, -37.907]} rotation={[-0.748, 0.962, 0.651]} scale={106.361}>
        <mesh geometry={nodes.Cylinder016.geometry} material={materials['Adornos.013']} />
        <mesh geometry={nodes.Cylinder016_1.geometry} material={materials['Adornos.001']} />
        <mesh geometry={nodes.Cylinder016_2.geometry} material={materials['Adornos.002']} />
        <mesh geometry={nodes.Cylinder016_3.geometry} material={materials['Adornos.003']} />
        <mesh geometry={nodes.Cylinder016_4.geometry} material={materials['Adornos.004']} />
        <mesh geometry={nodes.Cylinder016_5.geometry} material={materials['Adornos.005']} />
        <mesh geometry={nodes.Cylinder016_6.geometry} material={materials['Adornos.006']} />
        <mesh geometry={nodes.Cylinder016_7.geometry} material={materials['Adornos.007']} />
        <mesh geometry={nodes.Cylinder016_8.geometry} material={materials['Adornos.008']} />
        <mesh geometry={nodes.Cylinder016_9.geometry} material={materials['Adornos.009']} />
        <mesh geometry={nodes.Cylinder016_10.geometry} material={materials['Adornos.010']} />
        <mesh geometry={nodes.Cylinder016_11.geometry} material={materials['Adornos.011']} />
        <mesh geometry={nodes.Cylinder016_12.geometry} material={materials['Adornos.012']} />
        <mesh geometry={nodes.Cylinder016_13.geometry} material={materials['Adornos.014']} />
        <mesh geometry={nodes.Cylinder016_14.geometry} material={materials['Adornos.015']} />
        <mesh geometry={nodes.Cylinder016_15.geometry} material={materials['Adornos.016']} />
      </group>
    </group>
  )
}

useGLTF.preload('/cake.gltf')

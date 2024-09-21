import { useRef, useState, useEffect } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import robotoFont from '../public/Almendra_Bold.json' 

extend({ TextGeometry })

export function SpinningBox({ scale, ...props }) {
  const font = new FontLoader().parse(robotoFont)
  
  // This reference gives us direct access to the THREE.Mesh and TextGeometry objects
  const ref = useRef()
  const textRef = useRef()
  
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  
  useCursor(hovered)

  // Center the text geometry once the component is mounted
  useEffect(() => {
    if (textRef.current) {
      textRef.current.center() // Center the geometry
    }
  }, [textRef])

  // Scroll the page downward when clicked
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.scrollY + window.innerHeight, // Scroll down by the viewport height
      behavior: 'smooth', // Smooth scroll
    })
  }

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? scale * 1.4 : scale * 1.2}
      onClick={() => {
        click(!clicked)
        handleScrollDown() // Trigger the scroll down on click
      }}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      {/* TextGeometry with loaded font */}
      <textGeometry
        ref={textRef}
        args={['Hii !', { font, size: 1, height: 0.2 }]}
      />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'indianred'} />
    </mesh>
  )
}

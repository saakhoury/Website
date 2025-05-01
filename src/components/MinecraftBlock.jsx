'use client'
import React, { useRef } from 'react'
import * as THREE from 'three'

// Custom Minecraft block with different textures for each face
export default function MinecraftBlock({ position, textures, size = [1, 1, 1] }) {
  const meshRef = useRef()
  
  // Skip rendering if textures aren't loaded yet
  if (!textures || !textures.top) return null
  
  // Create materials for each face
  const materials = [
    new THREE.MeshStandardMaterial({ map: textures.right || textures.side || textures.top }),
    new THREE.MeshStandardMaterial({ map: textures.left || textures.side || textures.top }),
    new THREE.MeshStandardMaterial({ map: textures.top }),
    new THREE.MeshStandardMaterial({ map: textures.bottom || textures.side || textures.top }),
    new THREE.MeshStandardMaterial({ map: textures.front || textures.side || textures.top }),
    new THREE.MeshStandardMaterial({ map: textures.back || textures.side || textures.top })
  ]
  
  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      castShadow 
      receiveShadow
    >
      <boxGeometry args={size} />
      {materials.map((material, idx) => (
        <meshStandardMaterial key={idx} attach={`material-${idx}`} {...material} />
      ))}
    </mesh>
  )
}

// For simple blocks that use the same texture on all sides
export function SimpleBlock({ position, texture, size = [1, 1, 1] }) {
  const meshRef = useRef()
  
  // Skip rendering if texture isn't loaded yet
  if (!texture) return null
  
  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
} 
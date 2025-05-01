'use client'
import { useTexture } from '@react-three/drei'
import { useEffect, useState } from 'react'
import * as THREE from 'three'

// Utility to create a colored canvas texture
const createTextureCanvas = (color, size = 16, type = '') => {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  
  if (context) {
    context.fillStyle = color
    context.fillRect(0, 0, size, size)
    
    // Add a slight border to mimic Minecraft textures
    context.strokeStyle = color === '#3853a4' ? '#2a407a' : 
                          color === '#5a8c3e' ? '#4a7534' : 
                          color === '#634223' ? '#52371d' : '#666666'
    context.lineWidth = 1
    context.strokeRect(0, 0, size, size)
    
    // If it's grass top, add some grass detail
    if (type === 'grass_top') {
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * size
        const y = Math.random() * size / 2
        context.fillStyle = Math.random() > 0.5 ? '#4a7534' : '#6a9c4e'
        context.fillRect(x, y, 1, 2)
      }
    }
    
    // If it's grass side, create a two-tone texture
    if (type === 'grass_side') {
      // Dirt bottom
      context.fillStyle = '#634223'
      context.fillRect(0, size/2, size, size/2)
      context.strokeStyle = '#52371d'
      context.strokeRect(0, size/2, size, size/2)
      
      // Grass detail on top part
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * size
        const y = Math.random() * size / 4
        context.fillStyle = Math.random() > 0.5 ? '#4a7534' : '#6a9c4e'
        context.fillRect(x, y, 1, 2)
      }
    }
    
    // If it's water, add water detail
    if (type === 'water') {
      context.fillStyle = '#4a64b5'
      for (let i = 0; i < 4; i++) {
        const x = Math.random() * size
        const y = Math.random() * size
        context.fillRect(x, y, 2, 1)
      }
    }
    
    // If it's crafting table, add details
    if (type === 'crafting_table') {
      // Grid pattern
      context.strokeStyle = '#000'
      context.lineWidth = 1
      context.beginPath()
      context.moveTo(size/2, 0)
      context.lineTo(size/2, size)
      context.moveTo(0, size/2)
      context.lineTo(size, size/2)
      context.stroke()
      
      // Tools symbol
      context.fillStyle = '#555'
      context.fillRect(size/4, size/4, size/8, size/2) // Handle
      context.fillRect(size/4, size/4, size/2, size/8) // Cross part
    }
  }
  
  return canvas
}

// Generate basic Minecraft textures dynamically
export const useMinecraftTextures = () => {
  const [textures, setTextures] = useState({
    grass: null,
    dirt: null,
    stone: null, 
    wood: null,
    leaves: null,
    water: null,
    craftingTable: null,
    flower: null,
    flower2: null
  })
  
  const [blockTextures, setBlockTextures] = useState({
    grass: { top: null, side: null, bottom: null },
    dirt: { all: null },
    stone: { all: null },
    wood: { top: null, side: null },
    water: { all: null }
  })
  
  useEffect(() => {
    // Create textures from canvases
    const grassTopCanvas = createTextureCanvas('#5a8c3e', 16, 'grass_top')
    const grassSideCanvas = createTextureCanvas('#5a8c3e', 16, 'grass_side')
    const dirtCanvas = createTextureCanvas('#634223')
    const stoneCanvas = createTextureCanvas('#7e7e7e')
    const woodTopCanvas = createTextureCanvas('#8B5A2B', 16, 'wood_top')
    const woodSideCanvas = createTextureCanvas('#634223', 16, 'wood_side')
    const leavesCanvas = createTextureCanvas('#5a8c3e')
    const waterCanvas = createTextureCanvas('#3853a4', 16, 'water')
    const craftingCanvas = createTextureCanvas('#8B4513', 16, 'crafting_table')
    
    const flowerCanvas = createTextureCanvas('#E91E63', 8)
    const flower2Canvas = createTextureCanvas('#FFEB3B', 8)
    
    // Create textures from canvases
    const grassTop = new THREE.CanvasTexture(grassTopCanvas)
    const grassSide = new THREE.CanvasTexture(grassSideCanvas)
    const dirt = new THREE.CanvasTexture(dirtCanvas)
    const stone = new THREE.CanvasTexture(stoneCanvas)
    const woodTop = new THREE.CanvasTexture(woodTopCanvas)
    const woodSide = new THREE.CanvasTexture(woodSideCanvas)
    const leaves = new THREE.CanvasTexture(leavesCanvas)
    const water = new THREE.CanvasTexture(waterCanvas)
    const craftingTable = new THREE.CanvasTexture(craftingCanvas)
    const flower = new THREE.CanvasTexture(flowerCanvas)
    const flower2 = new THREE.CanvasTexture(flower2Canvas)
    
    // Set NearestFilter to get that pixelated Minecraft look
    const pixelateTexture = (texture) => {
      texture.magFilter = THREE.NearestFilter
      texture.minFilter = THREE.NearestFilter
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(1, 1)
      return texture
    }
    
    // Set simple textures
    setTextures({
      grass: pixelateTexture(grassTop),
      dirt: pixelateTexture(dirt),
      stone: pixelateTexture(stone),
      wood: pixelateTexture(woodSide),
      leaves: pixelateTexture(leaves),
      water: pixelateTexture(water),
      craftingTable: pixelateTexture(craftingTable),
      flower: pixelateTexture(flower),
      flower2: pixelateTexture(flower2)
    })
    
    // Set block textures with different faces
    setBlockTextures({
      grass: {
        top: pixelateTexture(grassTop),
        side: pixelateTexture(grassSide),
        bottom: pixelateTexture(dirt)
      },
      dirt: {
        all: pixelateTexture(dirt)
      },
      stone: {
        all: pixelateTexture(stone)
      },
      wood: {
        top: pixelateTexture(woodTop),
        side: pixelateTexture(woodSide)
      },
      water: {
        all: pixelateTexture(water)
      }
    })
  }, [])
  
  return { textures, blockTextures }
} 
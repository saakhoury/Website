'use client'
import React, { useRef, useEffect, useState } from 'react'
import { create } from 'zustand'

// Store for game state
const useStore = create((set) => ({
  timeOfDay: 'night',
  toggleTimeOfDay: () => set((state) => ({ 
    timeOfDay: state.timeOfDay === 'day' ? 'night' : 'day' 
  })),
}))

// Simple noise function for terrain generation - modified for smoother terrain
const generateNoise = (x, z) => {
  // Using a smoother noise pattern with smaller amplitude for more pleasing terrain
  const value = Math.sin(x * 0.2) * Math.cos(z * 0.2) * 0.4 + 
                Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.2;
  return Math.round(value * 1.5);
}

// Add some randomness to terrain for more natural look
const getTerrainType = (x, z, height) => {
  // Random value based on position for consistency
  const random = Math.abs(Math.sin(x * 12.3 + z * 5.7) * 10000) % 10;
  
  // Create patches of dirt in grass areas
  if (height >= 0 && random < 1.5) {
    return 'dirt';
  }
  
  // Default terrain types based on height and position
  if (height <= -1) {
    return 'dirt'; // Underwater
  } else if (height === 0) {
    return 'grass';
  } else if (Math.abs(x) + Math.abs(z) > 18) {
    return 'sand';
  } else {
    return 'grass';
  }
}

// River path function - returns true if position is part of river
const isRiverPosition = (x, z) => {
  // Create winding river path using sine waves
  const riverWidth = 2.5;
  const riverPath = Math.sin(z * 0.2) * 3; // Winding path
  
  return Math.abs(x - riverPath) < riverWidth && z > -10 && z < 5;
}

// Main Minecraft Scene Component
export default function MinecraftScene() {
  const canvasRef = useRef(null)
  const { timeOfDay, toggleTimeOfDay } = useStore()
  const [sceneState, setSceneState] = useState(null)
  
  // Initialize and render the Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return
    
    // Skip initialization if already done
    if (sceneState) return
    
    // Dynamically import Three.js to avoid SSR issues
    Promise.all([
      import('three'),
      import('three/examples/jsm/controls/OrbitControls.js'),
      import('three/examples/jsm/utils/BufferGeometryUtils.js')
    ]).then(([THREE, { OrbitControls }, BufferGeometryUtils]) => {
      // Initialize scene
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true
      })
      
      // Set up basic size and renderer
      renderer.setSize(500, 500)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      
      // Add OrbitControls for interaction
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.rotateSpeed = 0.5
      controls.enableZoom = true
      controls.enablePan = true
      
      // Set initial camera position
      camera.position.set(15, 12, 15)
      camera.lookAt(0, 0, 0)
      
      // Block textures
      const createTexture = (color, details = null) => {
        const canvas = document.createElement('canvas')
        canvas.width = 16
        canvas.height = 16
        const ctx = canvas.getContext('2d')
        
        // Fill with main color
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 16, 16)
        
        // Add details if specified
        if (details) {
          if (details.type === 'dots') {
            ctx.fillStyle = details.color
            ctx.fillRect(4, 4, 2, 2)
            ctx.fillRect(10, 4, 2, 2)
            ctx.fillRect(4, 10, 2, 2)
            ctx.fillRect(10, 10, 2, 2)
          } else if (details.type === 'stripes') {
            ctx.fillStyle = details.color
            for (let i = 0; i < 16; i += 4) {
              ctx.fillRect(i, 0, 2, 16)
            }
          } else if (details.type === 'door') {
            // Door details - panels
            ctx.fillStyle = '#9c3636' // Deep red color for door
            ctx.fillRect(0, 0, 16, 16)
            
            // Door handle
            ctx.fillStyle = '#ffcc00' // Bright yellow handle
            ctx.fillRect(2, 8, 3, 3)
            
            // Door panels
            ctx.fillStyle = '#cc0000' // Brighter red panels
            ctx.fillRect(4, 2, 8, 5) 
            ctx.fillRect(4, 9, 8, 5)
            
            // Door borders
            ctx.strokeStyle = '#ffcc00' // Yellow border
            ctx.lineWidth = 2
            ctx.strokeRect(0, 0, 16, 16) // Outer border
            ctx.strokeRect(4, 2, 8, 5)   // Top panel border
            ctx.strokeRect(4, 9, 8, 5)   // Bottom panel border
          } else if (details.type === 'window') {
            // Window cross pattern
            ctx.fillStyle = details.color
            ctx.fillRect(7, 0, 2, 16)
            ctx.fillRect(0, 7, 16, 2)
          } else if (details.type === 'stars') {
            // Add stars to night sky
            ctx.fillStyle = details.color
            for (let i = 0; i < 8; i++) {
              const x = Math.random() * 16
              const y = Math.random() * 16
              const size = Math.random() * 1.5 + 0.5
              ctx.fillRect(x, y, size, size)
            }
          } else if (details.type === 'lamp_texture') {
            // Create a more vibrant lamp texture with glow effect
            
            // Create radial gradient for glow effect
            const gradient = ctx.createRadialGradient(8, 8, 2, 8, 8, 8);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.3, '#ffee88');
            gradient.addColorStop(0.7, '#ffcc44');
            gradient.addColorStop(1, '#ff9900');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 16, 16);
            
            // Add a subtle pattern
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillRect(3, 3, 2, 2);
            ctx.fillRect(11, 3, 2, 2);
            ctx.fillRect(3, 11, 2, 2);
            ctx.fillRect(11, 11, 2, 2);
            ctx.fillRect(7, 7, 2, 2);
            
            // Add a brighter center
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(7, 7, 2, 2);
            
            // Add a subtle inner glow
            ctx.fillStyle = 'rgba(255, 255, 200, 0.3)';
            ctx.beginPath();
            ctx.arc(8, 8, 6, 0, Math.PI * 2);
            ctx.fill();
          } else if (details.type === 'lantern_texture') {
            // Create a more Minecraft-like lantern texture
            
            // Dark frame color
            ctx.fillStyle = '#333333';
            ctx.fillRect(0, 0, 16, 16);
            
            // Top cap
            ctx.fillStyle = '#444444';
            ctx.fillRect(3, 0, 10, 3);
            
            // Bottom cap
            ctx.fillStyle = '#444444';
            ctx.fillRect(3, 13, 10, 3);
            
            // Golden/glowing interior
            ctx.fillStyle = details.glowing ? '#ffee88' : '#dd9933';
            ctx.fillRect(3, 3, 10, 10);
            
            // Cross bars (metal frame)
            ctx.fillStyle = '#555555';
            // Vertical bars
            ctx.fillRect(3, 3, 1, 10);
            ctx.fillRect(12, 3, 1, 10);
            // Horizontal bars
            ctx.fillRect(3, 3, 10, 1);
            ctx.fillRect(3, 12, 10, 1);
            ctx.fillRect(3, 7, 10, 2);
            
            // Add highlight/glow if needed
            if (details.glowing) {
              // Center glow
              const glowGradient = ctx.createRadialGradient(8, 8, 2, 8, 8, 6);
              glowGradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
              glowGradient.addColorStop(1, 'rgba(255, 200, 50, 0.0)');
              
              ctx.fillStyle = glowGradient;
              ctx.fillRect(4, 4, 8, 8);
              
              // Add brighter center
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(7, 7, 2, 2);
            }
            
            // Chain/hook at top
            ctx.fillStyle = '#777777';
            ctx.fillRect(7, 0, 2, 2);
          } else if (details.type === 'brick_texture') {
            // Create a brick texture pattern
            ctx.fillStyle = '#a54f36'; // Base brick color
            ctx.fillRect(0, 0, 16, 16);
            
            // Add brick pattern
            ctx.fillStyle = '#8b3923'; // Darker color for mortar
            
            // Horizontal mortar lines
            ctx.fillRect(0, 4, 16, 1);
            ctx.fillRect(0, 12, 16, 1);
            
            // Vertical mortar lines - staggered pattern
            ctx.fillRect(4, 0, 1, 4);
            ctx.fillRect(12, 0, 1, 4);
            
            ctx.fillRect(0, 5, 1, 7);
            ctx.fillRect(8, 5, 1, 7);
            
            ctx.fillRect(4, 13, 1, 3);
            ctx.fillRect(12, 13, 1, 3);
            
            // Add some texture/variation to the bricks
            ctx.fillStyle = '#c25a40'; // Lighter color for highlights
            for (let i = 0; i < 5; i++) {
              const x = Math.floor(Math.random() * 14) + 1;
              const y = Math.floor(Math.random() * 14) + 1;
              const size = Math.floor(Math.random() * 2) + 1;
              
              // Skip if on mortar lines
              if (y === 4 || y === 12 || x === 4 || x === 12 || x === 0 || x === 8) continue;
              
              ctx.fillRect(x, y, size, size);
            }
          }
        }
        
        // Add border
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 1
        ctx.strokeRect(0, 0, 16, 16)
        
        const texture = new THREE.CanvasTexture(canvas)
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.NearestFilter
        
        return texture
      }
      
      // Basic block textures
      const textures = {
        grass_top: createTexture('#62a044'), // Brighter green for better contrast
        grass_side: createTexture('#8B5A2B', { type: 'stripes', color: '#62a044' }),
        dirt: createTexture('#8B5A2B'),
        stone: createTexture('#7e7e7e', { type: 'dots', color: '#666666' }),
        wood_top: createTexture('#b17f4a', { type: 'dots', color: '#8B5A2B' }), // Higher contrast brown
        wood_side: createTexture('#8B5A2B', { type: 'stripes', color: '#b17f4a' }),
        planks: createTexture('#e0a978', { type: 'stripes', color: '#c68642' }), // Brighter planks
        leaves: createTexture('#3f7d32', { type: 'dots', color: '#2d5b24' }),
        water: createTexture('#4466cc'), // More vibrant blue
        sand: createTexture('#f0e6b2'), // Brighter sand
        gravel: createTexture('#686868', { type: 'dots', color: '#7e7e7e' }),
        crafting: createTexture('#a06f3c'),
        door: createTexture('#9c3636', { type: 'door', color: '#cc0000' }),
        window: createTexture('#9bd8ff', { type: 'window', color: '#ffffff' }),
        stars: createTexture('#000033', { type: 'stars', color: '#ffffff' }),
        lamp: createTexture('#ffcc00', { type: 'lamp_texture' }),
        lantern: createTexture('#333333', { type: 'lantern_texture', glowing: false }),
        lantern_lit: createTexture('#333333', { type: 'lantern_texture', glowing: true }),
        brick: createTexture('#a54f36', { type: 'brick_texture' })
      }
      
      // Create a proper 6-sided cube with different textures
      const createCube = (x, y, z, type, options = {}) => {
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        let materials = []
        
        switch(type) {
          case 'grass':
            materials = [
              new THREE.MeshStandardMaterial({ map: textures.grass_side }), // right
              new THREE.MeshStandardMaterial({ map: textures.grass_side }), // left
              new THREE.MeshStandardMaterial({ map: textures.grass_top }), // top
              new THREE.MeshStandardMaterial({ map: textures.dirt }), // bottom
              new THREE.MeshStandardMaterial({ map: textures.grass_side }), // front
              new THREE.MeshStandardMaterial({ map: textures.grass_side }) // back
            ]
            break
          case 'wood':
            materials = [
              new THREE.MeshStandardMaterial({ map: textures.wood_side }), // right
              new THREE.MeshStandardMaterial({ map: textures.wood_side }), // left
              new THREE.MeshStandardMaterial({ map: textures.wood_top }), // top
              new THREE.MeshStandardMaterial({ map: textures.wood_top }), // bottom
              new THREE.MeshStandardMaterial({ map: textures.wood_side }), // front
              new THREE.MeshStandardMaterial({ map: textures.wood_side }) // back
            ]
            break
          case 'planks':
            materials = Array(6).fill(new THREE.MeshStandardMaterial({ map: textures.planks }))
            break
          case 'lamp':
            materials = Array(6).fill(new THREE.MeshStandardMaterial({ 
              map: textures.lamp,
              emissive: 0xffcc00,
              emissiveIntensity: options.glowing ? 1.0 : 0.2
            }))
            break
          case 'lantern':
            materials = Array(6).fill(new THREE.MeshStandardMaterial({ 
              map: options.glowing ? textures.lantern_lit : textures.lantern,
              emissive: 0xffcc00,
              emissiveIntensity: options.glowing ? 2.0 : 0.2
            }))
            break
          case 'door':
            materials = Array(6).fill(new THREE.MeshStandardMaterial({ 
              map: textures.door,
              side: THREE.DoubleSide,
              transparent: false,
              opacity: 1.0
            }))
            break
          case 'window':
            materials = [
              new THREE.MeshStandardMaterial({ map: textures.wood_side }),
              new THREE.MeshStandardMaterial({ map: textures.wood_side }),
              new THREE.MeshStandardMaterial({ map: textures.wood_side }),
              new THREE.MeshStandardMaterial({ map: textures.wood_side }),
              new THREE.MeshStandardMaterial({ map: textures.window }),
              new THREE.MeshStandardMaterial({ map: textures.window })
            ]
            break
          default:
            const texture = textures[type] || textures.stone
            materials = Array(6).fill(new THREE.MeshStandardMaterial({ map: texture }))
        }
        
        const cube = new THREE.Mesh(geometry, materials)
        cube.position.set(x, y, z)
        cube.castShadow = true
        cube.receiveShadow = true
        
        if (options.scale) {
          cube.scale.set(options.scale.x || 1, options.scale.y || 1, options.scale.z || 1)
        }
        
        return cube
      }
      
      // Store lamp lights for animation
      const lampLights = [];
      const smokeParticles = []; // Add array for smoke particles
      let clock = new THREE.Clock();
      
      // Store house data for reference across functions
      const houseData = {
        x: 4,
        z: 4,
        height: 0
      };
      
      // Build the Minecraft scene
      const buildScene = () => {
        scene.children.forEach(child => {
          if (!(child instanceof THREE.Light)) {
            scene.remove(child)
          }
        })
        
        // Reset lamp lights array
        lampLights.length = 0;
        
        // Larger world size for more terrain
        const worldSize = 12;
        
        const heightMap = {};
        
        // First pass: generate base terrain
        for (let x = -worldSize; x < worldSize; x++) {
          for (let z = -worldSize; z < worldSize; z++) {
            const height = generateNoise(x, z);
            heightMap[`${x},${z}`] = height;
          }
        }
        
        // Second pass: carve water features
        // Add a winding river 
        for (let x = -worldSize; x < worldSize; x++) {
          for (let z = -worldSize; z < worldSize; z++) {
            // Create river path
            if (isRiverPosition(x, z)) {
              heightMap[`${x},${z}`] = -1; // Set to water level
            }
          }
        }
        
        // Add circular pond in northeast
        const pondCenterX = 7;
        const pondCenterZ = -5;
        const pondRadius = 2.5;
        for (let x = pondCenterX - 3; x <= pondCenterX + 3; x++) {
          for (let z = pondCenterZ - 3; z <= pondCenterZ + 3; z++) {
            const distSq = (x - pondCenterX) * (x - pondCenterX) + (z - pondCenterZ) * (z - pondCenterZ);
            if (distSq < pondRadius * pondRadius) {
              heightMap[`${x},${z}`] = -1;
            }
          }
        }
        
        // Add small pool near south edge
        const southPoolX = 0;
        const southPoolZ = 10;
        for (let x = southPoolX - 2; x <= southPoolX + 2; x++) {
          for (let z = southPoolZ - 1; z <= southPoolZ + 2; z++) {
            if (Math.abs(x - southPoolX) + Math.abs(z - southPoolZ) < 3) {
              heightMap[`${x},${z}`] = -1;
            }
          }
        }
        
        // Use geometry instancing for better performance
        const grassGeometries = [];
        const dirtGeometries = [];
        const stoneGeometries = [];
        const sandGeometries = [];
        
        // Track which blocks need to be added individually if merging fails
        const grassBlocks = [];
        const dirtBlocks = [];
        const stoneBlocks = [];
        const sandBlocks = [];
        
        for (let x = -worldSize; x < worldSize; x++) {
          for (let z = -worldSize; z < worldSize; z++) {
            const height = heightMap[`${x},${z}`];
            
            if (height <= -1) {
              // Water areas
              const dirtGeo = new THREE.BoxGeometry(1, 1, 1);
              dirtGeo.translate(x, -1, z);
              dirtGeometries.push(dirtGeo);
              dirtBlocks.push({x: x, y: -1, z: z, type: 'dirt'});
              
              const waterBlock = createCube(x, 0, z, 'water', {
                scale: { y: 0.3 }
              });
              waterBlock.position.y = -0.35;
              scene.add(waterBlock);
              
              // Add some decorative elements to water
              if (Math.random() < 0.05) {
                // Small lily pad
                const lilyPad = createCube(x, -0.2, z, 'leaves');
                lilyPad.scale.set(0.4, 0.05, 0.4);
                scene.add(lilyPad);
              }
              
              // Put sand around some water edges (not for river, which should have grass edges)
              if (!isRiverPosition(x, z)) {
                for (let nx = x-1; nx <= x+1; nx++) {
                  for (let nz = z-1; nz <= z+1; nz++) {
                    // Only change blocks that are at ground level and not already water
                    const neighborHeight = heightMap[`${nx},${nz}`];
                    if (neighborHeight === 0 && Math.random() < 0.4) {
                      // This creates a sand bank effect
                      const sandBlock = createCube(nx, neighborHeight, nz, 'sand');
                      scene.add(sandBlock);
                    }
                  }
                }
              }
            } else {
              // Land areas - get terrain type for more natural variation
              const blockType = getTerrainType(x, z, height);
              
              if (blockType === 'grass') {
                const geo = new THREE.BoxGeometry(1, 1, 1);
                geo.translate(x, height, z);
                grassGeometries.push(geo);
                grassBlocks.push({x: x, y: height, z: z, type: 'grass'});
              } else if (blockType === 'dirt') {
                const geo = new THREE.BoxGeometry(1, 1, 1);
                geo.translate(x, height, z);
                dirtGeometries.push(geo);
                dirtBlocks.push({x: x, y: height, z: z, type: 'dirt'});
              } else {
                const geo = new THREE.BoxGeometry(1, 1, 1);
                geo.translate(x, height, z);
                sandGeometries.push(geo);
                sandBlocks.push({x: x, y: height, z: z, type: 'sand'});
              }
              
              // Add small rocks/stones randomly on the terrain
              if (Math.random() < 0.03) {
                const stoneBlock = createCube(x, height + 0.2, z, 'stone');
                stoneBlock.scale.set(0.3, 0.2, 0.3);
                scene.add(stoneBlock);
              }
              
              // Add dirt below grass
              for (let y = height - 1; y >= height - 2; y--) {
                const geo = new THREE.BoxGeometry(1, 1, 1);
                geo.translate(x, y, z);
                dirtGeometries.push(geo);
                dirtBlocks.push({x: x, y: y, z: z, type: 'dirt'});
              }
              
              // Add stone below dirt - limit depth for performance
              for (let y = height - 3; y >= Math.max(-3, height - 5); y--) {
                const geo = new THREE.BoxGeometry(1, 1, 1);
                geo.translate(x, y, z);
                stoneGeometries.push(geo);
                stoneBlocks.push({x: x, y: y, z: z, type: 'stone'});
              }
            }
          }
        }
        
        // Try to create merged geometries if possible
        try {
          if (grassGeometries.length > 0 && BufferGeometryUtils && BufferGeometryUtils.mergeGeometries) {
            const mergedGrassGeo = BufferGeometryUtils.mergeGeometries(grassGeometries);
            const grassMaterials = [
              new THREE.MeshStandardMaterial({ map: textures.grass_side }), // right
              new THREE.MeshStandardMaterial({ map: textures.grass_side }), // left
              new THREE.MeshStandardMaterial({ map: textures.grass_top }), // top
              new THREE.MeshStandardMaterial({ map: textures.dirt }), // bottom
              new THREE.MeshStandardMaterial({ map: textures.grass_side }), // front
              new THREE.MeshStandardMaterial({ map: textures.grass_side }) // back
            ];
            const grassMesh = new THREE.Mesh(mergedGrassGeo, grassMaterials);
            grassMesh.castShadow = true;
            grassMesh.receiveShadow = true;
            scene.add(grassMesh);
          } else {
            // Fallback: Add individual blocks
            grassBlocks.forEach(block => {
              scene.add(createCube(block.x, block.y, block.z, block.type));
            });
          }
          
          if (dirtGeometries.length > 0 && BufferGeometryUtils && BufferGeometryUtils.mergeGeometries) {
            const mergedDirtGeo = BufferGeometryUtils.mergeGeometries(dirtGeometries);
            const dirtMaterial = new THREE.MeshStandardMaterial({ map: textures.dirt });
            const dirtMesh = new THREE.Mesh(mergedDirtGeo, dirtMaterial);
            dirtMesh.castShadow = true;
            dirtMesh.receiveShadow = true;
            scene.add(dirtMesh);
          } else {
            // Fallback: Add individual blocks
            dirtBlocks.forEach(block => {
              scene.add(createCube(block.x, block.y, block.z, block.type));
            });
          }
          
          if (stoneGeometries.length > 0 && BufferGeometryUtils && BufferGeometryUtils.mergeGeometries) {
            const mergedStoneGeo = BufferGeometryUtils.mergeGeometries(stoneGeometries);
            const stoneMaterial = new THREE.MeshStandardMaterial({ map: textures.stone });
            const stoneMesh = new THREE.Mesh(mergedStoneGeo, stoneMaterial);
            stoneMesh.castShadow = true;
            stoneMesh.receiveShadow = true;
            scene.add(stoneMesh);
          } else {
            // Fallback: Add individual blocks
            stoneBlocks.forEach(block => {
              scene.add(createCube(block.x, block.y, block.z, block.type));
            });
          }
          
          if (sandGeometries.length > 0 && BufferGeometryUtils && BufferGeometryUtils.mergeGeometries) {
            const mergedSandGeo = BufferGeometryUtils.mergeGeometries(sandGeometries);
            const sandMaterial = new THREE.MeshStandardMaterial({ map: textures.sand });
            const sandMesh = new THREE.Mesh(mergedSandGeo, sandMaterial);
            sandMesh.castShadow = true;
            sandMesh.receiveShadow = true;
            scene.add(sandMesh);
          } else {
            // Fallback: Add individual blocks
            sandBlocks.forEach(block => {
              scene.add(createCube(block.x, block.y, block.z, block.type));
            });
          }
        } catch (error) {
          console.log("Geometry merging failed, falling back to individual blocks", error);
          // Fallback to individual blocks if merging fails
          grassBlocks.forEach(block => {
            scene.add(createCube(block.x, block.y, block.z, block.type));
          });
          
          dirtBlocks.forEach(block => {
            scene.add(createCube(block.x, block.y, block.z, block.type));
          });
          
          stoneBlocks.forEach(block => {
            scene.add(createCube(block.x, block.y, block.z, block.type));
          });
          
          sandBlocks.forEach(block => {
            scene.add(createCube(block.x, block.y, block.z, block.type));
          });
        }
        
        const addTree = (x, z, height) => {
          // Hard exit if no valid height - this prevents floating trees
          if (height === undefined || height < 0) return;
          
          // Add a dirt block underneath the tree for visual grounding
          scene.add(createCube(x, height, z, 'dirt'));
          
          // Taller tree trunks (4-5 blocks tall)
          const treeHeight = Math.random() > 0.5 ? 4 : 5;
          
          // Add trunk - simple straight line of blocks
          for (let y = 1; y <= treeHeight; y++) {
            scene.add(createCube(x, height + y, z, 'wood'));
          }
          
          // Start leaves at the second block of the trunk
          const leafBottom = height + Math.floor(treeHeight * 0.6);
          
          // Enhanced Minecraft-style leaf pattern that matches the game
          // Bottom layer (5x5 square with corners trimmed)
          for (let lx = -2; lx <= 2; lx++) {
            for (let lz = -2; lz <= 2; lz++) {
              // Skip the extreme corners
              if (Math.abs(lx) == 2 && Math.abs(lz) == 2) continue;
              scene.add(createCube(x + lx, leafBottom, z + lz, 'leaves'));
            }
          }
          
          // Middle layer (4x4 square with corners trimmed)
          for (let lx = -2; lx <= 2; lx++) {
            for (let lz = -2; lz <= 2; lz++) {
              // More leaves in the middle layer
              if (Math.abs(lx) == 2 && Math.abs(lz) == 2 && Math.random() < 0.5) continue;
              scene.add(createCube(x + lx, leafBottom + 1, z + lz, 'leaves'));
            }
          }
          
          // Upper middle layer (3x3 square)
          for (let lx = -1; lx <= 1; lx++) {
            for (let lz = -1; lz <= 1; lz++) {
              scene.add(createCube(x + lx, leafBottom + 2, z + lz, 'leaves'));
            }
          }
          
          // Top layer (plus shape)
          scene.add(createCube(x, leafBottom + 3, z, 'leaves'));
          scene.add(createCube(x + 1, leafBottom + 3, z, 'leaves'));
          scene.add(createCube(x - 1, leafBottom + 3, z, 'leaves'));
          scene.add(createCube(x, leafBottom + 3, z + 1, 'leaves'));
          scene.add(createCube(x, leafBottom + 3, z - 1, 'leaves'));
          
          // Pointy top (just one leaf block)
          if (treeHeight === 5) {
            scene.add(createCube(x, leafBottom + 4, z, 'leaves'));
          }
        }
        
        // Use fixed positions for trees that we know work
        const addTrees = () => {
          // Specific fixed positions that we know are on valid terrain
          const fixedTreePositions = [
            { x: -5, z: -5 },  // Northwest
            { x: 6, z: -4 },   // Northeast 
            { x: -6, z: 6 },   // Southwest
            { x: 8, z: 7 },    // Southeast
            { x: -9, z: 1 },   // West
            { x: 10, z: -8 },  // Far northeast
            { x: -10, z: -9 }, // Far northwest
            { x: 11, z: 9 },   // Far southeast
            { x: -11, z: 10 }  // Far southwest
          ];
          
          // Add trees at the fixed positions
          fixedTreePositions.forEach(pos => {
            // Get the height at this position
            const height = heightMap[`${pos.x},${pos.z}`];
            
            // Verify it's a valid position with a height
            if (height !== undefined && height >= 0) {
              // Check if the position is far enough from the house, water, and well
              if ((Math.abs(pos.x - 4) > 5 || Math.abs(pos.z - 4) > 5) && 
                  !(pos.x >= -4 && pos.x < -1 && pos.z >= -3 && pos.z < 0) &&
                  !(pos.x >= -5 && pos.x <= -3 && pos.z >= 0 && pos.z <= 2)) {
                // Make the tree
                addTree(pos.x, pos.z, height);
              }
            }
          });
        };
        
        // Replace the existing tree creation loop with our new method
        addTrees();
        
        const buildHouse = () => {
          const houseX = 4;
          const houseZ = 4;
          const houseHeight = heightMap[`${houseX},${houseZ}`] || 0;
          
          // Store house data for reference in other functions
          houseData.x = houseX;
          houseData.z = houseZ;
          houseData.height = houseHeight;
          
          // Foundation
          for (let x = houseX; x < houseX + 7; x++) {
            for (let z = houseZ; z < houseZ + 5; z++) {
              scene.add(createCube(x, houseHeight, z, 'stone'));
            }
          }
          
          // Add a brick chimney base inside the house
          scene.add(createCube(houseX + 5, houseHeight + 1, houseZ + 1, 'brick'));
          
          // Walls - use brick instead of planks for a more prominent house
          for (let x = houseX; x < houseX + 7; x++) {
            for (let y = 1; y <= 3; y++) {
              // Front wall - skip door position
              if (x === houseX + 3 && y <= 2) {
                // Skip the door position
                continue;
              }
              
              // Front and back walls - alternating pattern of brick and stone
              const material = (x + y) % 2 === 0 ? 'brick' : 'stone';
              scene.add(createCube(x, houseHeight + y, houseZ, material));
              scene.add(createCube(x, houseHeight + y, houseZ + 4, material));
            }
          }
          
          // Side walls - with alternating pattern
          for (let z = houseZ + 1; z < houseZ + 4; z++) {
            for (let y = 1; y <= 3; y++) {
              // Skip chimney position
              if (z === houseZ + 1 && y === 1 && houseX + 5) {
                continue;
              }
              
              // Alternating pattern for sides
              const leftMaterial = (z + y) % 2 === 0 ? 'brick' : 'stone';
              const rightMaterial = (z + y) % 2 === 1 ? 'brick' : 'stone';
              
              scene.add(createCube(houseX, houseHeight + y, z, leftMaterial));
              scene.add(createCube(houseX + 6, houseHeight + y, z, rightMaterial));
            }
          }
          
          // Roof frame - stone
          for (let x = houseX - 1; x < houseX + 8; x++) {
            for (let z = houseZ - 1; z < houseZ + 6; z++) {
              if ((x === houseX - 1 || x === houseX + 7) || (z === houseZ - 1 || z === houseZ + 5)) {
                scene.add(createCube(x, houseHeight + 4, z, 'stone'));
              } else {
                scene.add(createCube(x, houseHeight + 4, z, 'brick'));
              }
            }
          }
          
          // Peaked roof - brick
          for (let x = houseX; x < houseX + 7; x++) {
            for (let z = houseZ; z < houseZ + 5; z++) {
              scene.add(createCube(x, houseHeight + 5, z, 'brick'));
            }
          }
          
          // Roof peak - stone
          for (let x = houseX + 1; x < houseX + 6; x++) {
            for (let z = houseZ + 1; z < houseZ + 4; z++) {
              scene.add(createCube(x, houseHeight + 6, z, 'stone'));
            }
          }
          
          // Chimney - brick texture
          scene.add(createCube(houseX + 5, houseHeight + 7, houseZ + 1, 'brick'));
          scene.add(createCube(houseX + 5, houseHeight + 8, houseZ + 1, 'brick'));
          
          // Add brick path from door to outside
          for (let z = houseZ - 3; z < houseZ; z++) {
            scene.add(createCube(houseX + 3, heightMap[`${houseX + 3},${z}`] || 0, z, 'brick'));
          }
          
          // Extend stone path around the house
          // Left side path
          for (let x = houseX - 2; x < houseX; x++) {
            scene.add(createCube(x, heightMap[`${x},${houseZ}`] || 0, houseZ, 'stone'));
          }
          
          // Right side path
          for (let x = houseX + 7; x < houseX + 9; x++) {
            scene.add(createCube(x, heightMap[`${x},${houseZ + 2}`] || 0, houseZ + 2, 'stone'));
          }
          
          // Add a small garden area with "flowers" (colorful blocks)
          // Garden on the right side of the house
          for (let x = houseX + 7; x < houseX + 10; x++) {
            for (let z = houseZ; z < houseZ + 2; z++) {
              const height = heightMap[`${x},${z}`] || 0;
              scene.add(createCube(x, height, z, 'dirt'));
              
              // Add flower blocks
              if (Math.random() < 0.7) {
                const flowerBlock = createCube(x, height + 0.5, z, 'grass');
                flowerBlock.scale.set(0.3, 0.3, 0.3);
                flowerBlock.position.y = height + 0.15;
                scene.add(flowerBlock);
              }
            }
          }
          
          // Add fence around right side garden
          // Top fence (z = houseZ - 1)
          for (let x = houseX + 7; x < houseX + 10; x++) {
            const height = heightMap[`${x},${houseZ - 1}`] || 0;
            const fence = createCube(x, height + 0.5, houseZ - 1, 'wood');
            fence.scale.set(0.2, 0.5, 0.2);
            scene.add(fence);
          }
          // Bottom fence (z = houseZ + 2)
          for (let x = houseX + 7; x < houseX + 10; x++) {
            const height = heightMap[`${x},${houseZ + 2}`] || 0;
            const fence = createCube(x, height + 0.5, houseZ + 2, 'wood');
            fence.scale.set(0.2, 0.5, 0.2);
            scene.add(fence);
          }
          // Left fence (x = houseX + 6)
          for (let z = houseZ - 1; z <= houseZ + 2; z++) {
            if (z === houseZ + 2) continue; // Skip corner that has path
            const height = heightMap[`${houseX + 6},${z}`] || 0;
            const fence = createCube(houseX + 6, height + 0.5, z, 'wood');
            fence.scale.set(0.2, 0.5, 0.2);
            scene.add(fence);
          }
          // Right fence (x = houseX + 10)
          for (let z = houseZ - 1; z <= houseZ + 2; z++) {
            const height = heightMap[`${houseX + 10},${z}`] || 0;
            const fence = createCube(houseX + 10, height + 0.5, z, 'wood');
            fence.scale.set(0.2, 0.5, 0.2);
            scene.add(fence);
          }
          
          // Garden on the left side of the house
          for (let x = houseX - 3; x < houseX; x++) {
            for (let z = houseZ + 1; z < houseZ + 3; z++) {
              const height = heightMap[`${x},${z}`] || 0;
              scene.add(createCube(x, height, z, 'dirt'));
              
              // Add flower blocks
              if (Math.random() < 0.7) {
                const flowerBlock = createCube(x, height + 0.5, z, 'leaves');
                flowerBlock.scale.set(0.3, 0.3, 0.3);
                flowerBlock.position.y = height + 0.15;
                scene.add(flowerBlock);
              }
            }
          }
          
          // Add fence around left side garden
          // Top fence (z = houseZ)
          for (let x = houseX - 3; x < houseX; x++) {
            const height = heightMap[`${x},${houseZ}`] || 0;
            const fence = createCube(x, height + 0.5, houseZ, 'wood');
            fence.scale.set(0.2, 0.5, 0.2);
            scene.add(fence);
          }
          // Bottom fence (z = houseZ + 3)
          for (let x = houseX - 3; x < houseX; x++) {
            const height = heightMap[`${x},${houseZ + 3}`] || 0;
            const fence = createCube(x, height + 0.5, houseZ + 3, 'wood');
            fence.scale.set(0.2, 0.5, 0.2);
            scene.add(fence);
          }
          // Left fence (x = houseX - 3)
          for (let z = houseZ; z <= houseZ + 3; z++) {
            const height = heightMap[`${houseX - 3},${z}`] || 0;
            const fence = createCube(houseX - 3, height + 0.5, z, 'wood');
            fence.scale.set(0.2, 0.5, 0.2);
            scene.add(fence);
          }
          // Right fence (x = houseX - 1)
          for (let z = houseZ; z <= houseZ + 3; z++) {
            if (z === houseZ) continue; // Skip corner with path
            const height = heightMap[`${houseX - 1},${z}`] || 0;
            const fence = createCube(houseX - 1, height + 0.5, z, 'wood');
            fence.scale.set(0.2, 0.5, 0.2);
            scene.add(fence);
          }
          
          // Add decorative stone trim around the door
          scene.add(createCube(houseX + 2, houseHeight + 1, houseZ, 'stone'));
          scene.add(createCube(houseX + 2, houseHeight + 2, houseZ, 'stone'));
          scene.add(createCube(houseX + 3, houseHeight + 3, houseZ, 'stone'));
          scene.add(createCube(houseX + 4, houseHeight + 1, houseZ, 'stone'));
          scene.add(createCube(houseX + 4, houseHeight + 2, houseZ, 'stone'));
          
          // Add stone cornerstones for structure
          for (let y = 1; y <= 3; y++) {
            scene.add(createCube(houseX, houseHeight + y, houseZ, 'stone'));
            scene.add(createCube(houseX + 6, houseHeight + y, houseZ, 'stone'));
            scene.add(createCube(houseX, houseHeight + y, houseZ + 4, 'stone'));
            scene.add(createCube(houseX + 6, houseHeight + y, houseZ + 4, 'stone'));
          }
          
          // Add a small brick well near the house
          const wellX = houseX - 4;
          const wellZ = houseZ + 1;
          const wellHeight = heightMap[`${wellX},${wellZ}`] || 0;
          
          // Well base
          for (let x = wellX - 1; x <= wellX + 1; x++) {
            for (let z = wellZ - 1; z <= wellZ + 1; z++) {
              scene.add(createCube(x, wellHeight, z, 'brick'));
            }
          }
          
          // Well walls
          scene.add(createCube(wellX - 1, wellHeight + 1, wellZ - 1, 'brick'));
          scene.add(createCube(wellX - 1, wellHeight + 1, wellZ, 'brick'));
          scene.add(createCube(wellX - 1, wellHeight + 1, wellZ + 1, 'brick'));
          
          scene.add(createCube(wellX + 1, wellHeight + 1, wellZ - 1, 'brick'));
          scene.add(createCube(wellX + 1, wellHeight + 1, wellZ, 'brick'));
          scene.add(createCube(wellX + 1, wellHeight + 1, wellZ + 1, 'brick'));
          
          scene.add(createCube(wellX, wellHeight + 1, wellZ - 1, 'brick'));
          scene.add(createCube(wellX, wellHeight + 1, wellZ + 1, 'brick'));
          
          // Well water
          const waterBlock = createCube(wellX, wellHeight, wellZ, 'water', {
            scale: { y: 0.7 }
          });
          waterBlock.position.y = wellHeight - 0.15;
          scene.add(waterBlock);
          
          // Front door
          const doorBlockBottom = createCube(houseX + 3, houseHeight + 1, houseZ - 0.05, 'door');
          const doorBlockTop = createCube(houseX + 3, houseHeight + 2, houseZ - 0.05, 'door');
          
          // Make door blocks slightly thinner
          doorBlockBottom.scale.set(1, 1, 0.2);
          doorBlockTop.scale.set(1, 1, 0.2);
          
          scene.add(doorBlockBottom);
          scene.add(doorBlockTop);
          
          // Add glow near door based on time of day
          if (timeOfDay === 'night') {
            // Create a warm red glow for the entrance area - make it very subtle
            const doorGlowGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const doorGlowMaterial = new THREE.MeshBasicMaterial({
              color: 0xff3300,
              transparent: true,
              opacity: 0.15,
              blending: THREE.AdditiveBlending
            });
            const doorGlow = new THREE.Mesh(doorGlowGeometry, doorGlowMaterial);
            doorGlow.position.set(houseX + 3, houseHeight + 1.5, houseZ - 0.2);
            scene.add(doorGlow);
            
            // Add a stronger warm light source for the actual lighting effect
            const doorLight = new THREE.PointLight(0xff5500, 2.5, 7);
            doorLight.position.set(houseX + 3, houseHeight + 1.5, houseZ - 0.3);
            scene.add(doorLight);
            
            // Add a second, broader ambient light to create a more natural effect
            const doorAmbientLight = new THREE.PointLight(0xff6630, 1.0, 4);
            doorAmbientLight.position.set(houseX + 3, houseHeight + 1.2, houseZ - 0.1);
            scene.add(doorAmbientLight);
            
            // Store for animation
            lampLights.push({
              main: doorLight,
              ambient: doorAmbientLight,
              glowMesh: doorGlow,
              baseIntensity: {
                main: 2.5,
                ambient: 1.0
              },
              height: houseHeight
            });
          }
          
          // Windows - add more windows around the house
          scene.add(createCube(houseX + 1, houseHeight + 2, houseZ, 'window'));
          scene.add(createCube(houseX + 5, houseHeight + 2, houseZ, 'window'));
          scene.add(createCube(houseX, houseHeight + 2, houseZ + 1, 'window'));
          scene.add(createCube(houseX, houseHeight + 2, houseZ + 3, 'window'));
          scene.add(createCube(houseX + 6, houseHeight + 2, houseZ + 1, 'window'));
          scene.add(createCube(houseX + 6, houseHeight + 2, houseZ + 3, 'window'));
          scene.add(createCube(houseX + 2, houseHeight + 2, houseZ + 4, 'window'));
          scene.add(createCube(houseX + 4, houseHeight + 2, houseZ + 4, 'window'));
          
          // Add chimney glow effect and smoke for nighttime
          if (timeOfDay === 'night') {
            // Chimney glow effect (similar to lamps but orange/red)
            const chimneyGlowGeometry = new THREE.SphereGeometry(0.6, 16, 16);
            const chimneyGlowMaterial = new THREE.MeshBasicMaterial({
              color: 0xff5500,
              transparent: true,
              opacity: 0.35,
              blending: THREE.AdditiveBlending
            });
            const chimneyGlow = new THREE.Mesh(chimneyGlowGeometry, chimneyGlowMaterial);
            chimneyGlow.position.set(houseX + 5, houseHeight + 8.5, houseZ + 1);
            scene.add(chimneyGlow);
            
            // Add a subtle flickering chimney light
            const chimneyLight = new THREE.PointLight(0xff3300, 3.0, 10);
            chimneyLight.position.set(houseX + 5, houseHeight + 8.2, houseZ + 1);
            scene.add(chimneyLight);
            
            // Create smoke particles system
            const smokeCount = 15;
            for (let i = 0; i < smokeCount; i++) {
              // Create small, gray particles for smoke
              const smokeGeometry = new THREE.SphereGeometry(Math.random() * 0.15 + 0.05, 8, 8);
              const smokeMaterial = new THREE.MeshBasicMaterial({
                color: 0x888888,
                transparent: true,
                opacity: Math.random() * 0.2 + 0.1
              });
              const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
              
              // Set random initial positions around the chimney top
              const offsetX = (Math.random() - 0.5) * 0.2;
              const offsetZ = (Math.random() - 0.5) * 0.2;
              const offsetY = Math.random() * 0.1;
              
              smoke.position.set(
                houseX + 5 + offsetX, 
                houseHeight + 8.5 + offsetY, 
                houseZ + 1 + offsetZ
              );
              
              // Store initial position and other animation properties
              smoke.userData = {
                initialY: houseHeight + 8.5 + offsetY,
                speed: Math.random() * 0.01 + 0.005,
                wiggle: Math.random() * 0.01 + 0.003,
                lifespan: Math.random() * 10 + 5,
                age: Math.random() * 10, // randomize initial age
                fadeStart: 3 // when to start fading
              };
              
              scene.add(smoke);
              smokeParticles.push(smoke);
            }
            
            // Store the chimney light for animation
            lampLights.push({
              main: chimneyLight,
              glowMesh: chimneyGlow,
              baseIntensity: {
                main: 3.0
              },
              height: houseHeight
            });
          } else {
            // Daytime - just subtle smoke
            const daySmokeCount = 8; // Fewer smoke particles for daytime
            for (let i = 0; i < daySmokeCount; i++) {
              // Create smaller, lighter smoke particles
              const smokeGeometry = new THREE.SphereGeometry(Math.random() * 0.1 + 0.05, 8, 8);
              const smokeMaterial = new THREE.MeshBasicMaterial({
                color: 0xcccccc, // Lighter color for daytime
                transparent: true,
                opacity: Math.random() * 0.1 + 0.05 // More transparent
              });
              const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
              
              // Set random initial positions around the chimney top
              const offsetX = (Math.random() - 0.5) * 0.2;
              const offsetZ = (Math.random() - 0.5) * 0.2;
              const offsetY = Math.random() * 0.1;
              
              smoke.position.set(
                houseX + 5 + offsetX, 
                houseHeight + 8.5 + offsetY, 
                houseZ + 1 + offsetZ
              );
              
              // Store initial position with slightly different animation properties
              smoke.userData = {
                initialY: houseHeight + 8.5 + offsetY,
                speed: Math.random() * 0.008 + 0.003, // Slower rising
                wiggle: Math.random() * 0.005 + 0.002, // Less wiggle
                lifespan: Math.random() * 8 + 4, // Shorter lifespan
                age: Math.random() * 8, // Randomize initial age
                fadeStart: 2 // Start fading earlier
              };
              
              scene.add(smoke);
              smokeParticles.push(smoke);
            }
          }
        }
        
        buildHouse();
        
        // Water pool - make it a cleaner, more defined shape
        for (let x = -4; x < -1; x++) {
          for (let z = -3; z < 0; z++) {
            // Create a flat area around the water for better visuals
            for (let nx = x-1; nx <= x+1; nx++) {
              for (let nz = z-1; nz <= z+1; nz++) {
                // Only modify terrain height if it's not within the water area
                if (!(nx >= -4 && nx < -1 && nz >= -3 && nz < 0)) {
                  // Set surrounding terrain to a consistent height
                  heightMap[`${nx},${nz}`] = 0;
                }
              }
            }
            
            // Add the water block
            const waterBlock = createCube(x, 0, z, 'water', {
              scale: { y: 0.3 }
            });
            waterBlock.position.y = -0.35;
            scene.add(waterBlock);
          }
        }
        
        // Add a small waterfall from river to pond (if river exists)
        if (heightMap[`0,5`] === -1 && heightMap[`0,6`] !== -1) {
          // Create flowing water effect
          const waterfall1 = createCube(0, 0, 5, 'water', { scale: { y: 0.7, z: 0.5 } });
          waterfall1.position.z = 5.25;
          waterfall1.position.y = -0.15;
          scene.add(waterfall1);
          
          const waterfall2 = createCube(0, -0.5, 6, 'water', { scale: { y: 0.7, z: 0.5 } });
          waterfall2.position.z = 5.75;
          waterfall2.position.y = -0.65;
          scene.add(waterfall2);
          
          // Add animated mist particle if night time
          if (timeOfDay === 'night') {
            const mistGeometry = new THREE.SphereGeometry(0.3, 8, 8);
            const mistMaterial = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.15
            });
            const mist = new THREE.Mesh(mistGeometry, mistMaterial);
            mist.position.set(0, 0, 5.5);
            scene.add(mist);
            
            smokeParticles.push({
              mesh: mist,
              speed: 0.005,
              age: 0,
              maxAge: 100,
              initialY: 0,
              initialOpacity: 0.15
            });
          }
        }
        
        // Add decorative fountain in front of house
        const fountainX = 4;
        const fountainZ = -1;
        const fountainHeight = heightMap[`${fountainX},${fountainZ}`] || 0;
        
        // Create circular stone base
        for (let x = fountainX - 1; x <= fountainX + 1; x++) {
          for (let z = fountainZ - 1; z <= fountainZ + 1; z++) {
            if (Math.abs(x - fountainX) + Math.abs(z - fountainZ) <= 1.5) {
              scene.add(createCube(x, fountainHeight, z, 'stone'));
            }
          }
        }
        
        // Create central water block
        const fountainWater = createCube(fountainX, fountainHeight + 0.7, fountainZ, 'water', {
          scale: { y: 0.3, x: 0.8, z: 0.8 }
        });
        fountainWater.position.y = fountainHeight + 0.7;
        scene.add(fountainWater);
        
        // Add fountain base
        scene.add(createCube(fountainX, fountainHeight + 1, fountainZ, 'stone'));
        
        // Add light to fountain at night
        if (timeOfDay === 'night') {
          const fountainLight = new THREE.PointLight(0x4477ff, 1, 5);
          fountainLight.position.set(fountainX, fountainHeight + 1.5, fountainZ);
          scene.add(fountainLight);
          
          // Add glow
          const fountainGlow = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.MeshBasicMaterial({
              color: 0x4477ff,
              transparent: true,
              opacity: 0.1,
              blending: THREE.AdditiveBlending
            })
          );
          fountainGlow.position.set(fountainX, fountainHeight + 1.5, fountainZ);
          scene.add(fountainGlow);
          
          // Store for animation
          lampLights.push({
            main: fountainLight,
            glowMesh: fountainGlow,
            baseIntensity: {
              main: 1
            },
            height: fountainHeight
          });
        }
        
        const addLamps = () => {
          const lampPositions = [
            { x: -7, z: -7 },
            { x: 8, z: -7 },
            { x: -7, z: 8 },
            { x: 8, z: 8 },
            { x: 0, z: -6 },
            { x: -5, z: 0 },
            { x: 4, z: 1 },
            { x: 4, z: 7 },
            { x: -3, z: 4 },
            { x: 10, z: 2 },
            // Add a few more lamps for the larger world
            { x: -9, z: 0 },
            { x: 9, z: 9 },
            { x: -9, z: -9 },
            { x: 0, z: 9 }
          ];
          
          lampPositions.forEach(pos => {
            // Get the exact terrain height at this position
            const height = heightMap[`${pos.x},${pos.z}`];
            
            // Skip if underwater or undefined
            if (height === undefined || height < 0) return;
            
            // Add a stone base for better grounding
            scene.add(createCube(pos.x, height, pos.z, 'stone'));
            
            // Add wooden pole
            scene.add(createCube(pos.x, height + 1, pos.z, 'wood'));
            scene.add(createCube(pos.x, height + 2, pos.z, 'wood'));
            
            // Add small wood pieces on top to hold the lantern
            const woodTop = createCube(pos.x, height + 3, pos.z, 'wood');
            woodTop.scale.set(0.6, 0.2, 0.6);
            woodTop.position.y = height + 2.9;
            scene.add(woodTop);
            
            // Create lantern with glowing effect (smaller than a full block)
            const lantern = createCube(pos.x, height + 3.3, pos.z, 'lantern', {
              glowing: timeOfDay === 'night'
            });
            
            // Make lantern slightly smaller than regular blocks for a better look
            lantern.scale.set(0.5, 0.6, 0.5);
            
            scene.add(lantern);

            // Add lighting effects based on time of day
            if (timeOfDay === 'night') {
              // Add a subtle glow mesh around the lantern
              const glowGeometry = new THREE.SphereGeometry(0.6, 16, 16);
              const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0xffee88,
                transparent: true,
                opacity: 0.35,
                blending: THREE.AdditiveBlending
              });
              const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
              glowMesh.position.set(pos.x, height + 3.3, pos.z);
              scene.add(glowMesh);
              
              // Add a light beam effect pointing downward and upward
              const beamGeometryDown = new THREE.CylinderGeometry(0.05, 0.4, 2.0, 8);
              const beamMaterialDown = new THREE.MeshBasicMaterial({
                color: 0xffffaa,
                transparent: true,
                opacity: 0.2,
                blending: THREE.AdditiveBlending
              });
              const beamDown = new THREE.Mesh(beamGeometryDown, beamMaterialDown);
              beamDown.position.set(pos.x, height + 2.7, pos.z);
              beamDown.rotation.x = Math.PI;
              scene.add(beamDown);
              
              // Upward beam
              const beamGeometryUp = new THREE.CylinderGeometry(0.05, 0.4, 2.0, 8);
              const beamMaterialUp = new THREE.MeshBasicMaterial({
                color: 0xffffaa,
                transparent: true,
                opacity: 0.2,
                blending: THREE.AdditiveBlending
              });
              const beamUp = new THREE.Mesh(beamGeometryUp, beamMaterialUp);
              beamUp.position.set(pos.x, height + 3.9, pos.z);
              scene.add(beamUp);
              
              // Add a stronger lamp light
              const lampLight = new THREE.PointLight(0xffcc00, 5, 15);
              lampLight.position.set(pos.x, height + 3.3, pos.z);
              scene.add(lampLight);
              
              // Add a smaller, more intense light for the glow effect
              const glowLight = new THREE.PointLight(0xffee88, 3, 5);
              glowLight.position.set(pos.x, height + 3.3, pos.z);
              scene.add(glowLight);
              
              // Add a subtle ambient light around the lamp
              const ambientLampLight = new THREE.PointLight(0xffaa00, 0.8, 8);
              ambientLampLight.position.set(pos.x, height + 3.3, pos.z);
              scene.add(ambientLampLight);

              // Store the lights and glow mesh for animation
              lampLights.push({
                main: lampLight,
                glow: glowLight,
                ambient: ambientLampLight,
                glowMesh: glowMesh,
                beamUp: beamUp,
                beamDown: beamDown,
                baseIntensity: {
                  main: 5,
                  glow: 3,
                  ambient: 0.8
                },
                height: height
              });
            } else {
              // Daytime - subtle glow effect
              const dayGlowGeometry = new THREE.SphereGeometry(0.3, 16, 16);
              const dayGlowMaterial = new THREE.MeshBasicMaterial({
                color: 0xffee88,
                transparent: true,
                opacity: 0.1,
                blending: THREE.AdditiveBlending
              });
              const dayGlowMesh = new THREE.Mesh(dayGlowGeometry, dayGlowMaterial);
              dayGlowMesh.position.set(pos.x, height + 3.3, pos.z);
              scene.add(dayGlowMesh);
              
              // Very subtle light for daytime
              const dayLampLight = new THREE.PointLight(0xffcc00, 0.5, 2);
              dayLampLight.position.set(pos.x, height + 3.3, pos.z);
              scene.add(dayLampLight);
              
              // Store for animation
              lampLights.push({
                main: dayLampLight,
                glowMesh: dayGlowMesh,
                baseIntensity: {
                  main: 0.5
                },
                height: height
              });
            }
          });
        };
        
        addLamps();
      }
      
      const updateTimeOfDay = (currentTimeOfDay) => {
        buildScene();
        
        if (currentTimeOfDay === 'day') {
          scene.background = new THREE.Color('#87CEEB');
        } else {
          scene.background = new THREE.Color('#001428'); // Slightly lighter night sky
          
          if (!scene.userData.stars) {
            // Main stars - many small stars
            const starsGeometry = new THREE.BufferGeometry();
            const starsMaterial = new THREE.PointsMaterial({
              color: 0xffffff,
              size: 0.15,
              sizeAttenuation: true
            });
            
            const starsVertices = [];
            for (let i = 0; i < 4000; i++) { // Doubled the number of stars
              const theta = 2 * Math.PI * Math.random();
              const phi = Math.acos(2 * Math.random() - 1);
              const radius = 50 + Math.random() * 10;
              
              const x = radius * Math.sin(phi) * Math.cos(theta);
              const y = radius * Math.sin(phi) * Math.sin(theta);
              const z = radius * Math.cos(phi);
              
              starsVertices.push(x, y, z);
            }
            
            starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
            const stars = new THREE.Points(starsGeometry, starsMaterial);
            scene.add(stars);
            scene.userData.stars = stars;
            
            // Add some larger, brighter stars
            const brightStarsGeometry = new THREE.BufferGeometry();
            const brightStarsMaterial = new THREE.PointsMaterial({
              color: 0xffffee,
              size: 0.4,
              sizeAttenuation: true
            });
            
            const brightStarsVertices = [];
            for (let i = 0; i < 200; i++) { // Double these too
              const theta = 2 * Math.PI * Math.random();
              const phi = Math.acos(2 * Math.random() - 1);
              const radius = 48 + Math.random() * 15;
              
              const x = radius * Math.sin(phi) * Math.cos(theta);
              const y = radius * Math.sin(phi) * Math.sin(theta);
              const z = radius * Math.cos(phi);
              
              brightStarsVertices.push(x, y, z);
            }
            
            brightStarsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(brightStarsVertices, 3));
            const brightStars = new THREE.Points(brightStarsGeometry, brightStarsMaterial);
            scene.add(brightStars);
            scene.userData.brightStars = brightStars;
            
            // Add a few very bright "special" stars
            const specialStarsGeometry = new THREE.BufferGeometry();
            const specialStarsMaterial = new THREE.PointsMaterial({
              color: 0xffffff,
              size: 0.6,
              sizeAttenuation: true
            });
            
            const specialStarsVertices = [];
            for (let i = 0; i < 30; i++) {
              const theta = 2 * Math.PI * Math.random();
              const phi = Math.acos(2 * Math.random() - 1);
              const radius = 45 + Math.random() * 15;
              
              const x = radius * Math.sin(phi) * Math.cos(theta);
              const y = radius * Math.sin(phi) * Math.sin(theta);
              const z = radius * Math.cos(phi);
              
              specialStarsVertices.push(x, y, z);
            }
            
            specialStarsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(specialStarsVertices, 3));
            const specialStars = new THREE.Points(specialStarsGeometry, specialStarsMaterial);
            scene.add(specialStars);
            scene.userData.specialStars = specialStars;
          }
        }
        
        scene.children.forEach(child => {
          if (child instanceof THREE.Light) {
            scene.remove(child);
          }
        });
        
        if (currentTimeOfDay === 'day' && scene.userData.stars) {
          scene.remove(scene.userData.stars);
          scene.userData.stars = null;
          
          if (scene.userData.brightStars) {
            scene.remove(scene.userData.brightStars);
            scene.userData.brightStars = null;
          }
          
          if (scene.userData.specialStars) {
            scene.remove(scene.userData.specialStars);
            scene.userData.specialStars = null;
          }
        }
        
        if (currentTimeOfDay === 'day') {
          const ambient = new THREE.AmbientLight(0xffffff, 0.5);
          scene.add(ambient);
          
          const sun = new THREE.DirectionalLight(0xffffff, 1);
          sun.position.set(10, 10, 5);
          sun.castShadow = true;
          sun.shadow.mapSize.width = 2048;
          sun.shadow.mapSize.height = 2048;
          sun.shadow.camera.near = 0.5;
          sun.shadow.camera.far = 50;
          sun.shadow.camera.left = -20;
          sun.shadow.camera.right = 20;
          sun.shadow.camera.top = 20;
          sun.shadow.camera.bottom = -20;
          scene.add(sun);
          
          const fillLight = new THREE.DirectionalLight(0xffffcc, 0.3);
          fillLight.position.set(-5, 8, -5);
          scene.add(fillLight);
        } else {
          // Darker ambient light for night to make lamps stand out more
          const ambient = new THREE.AmbientLight(0x334466, 0.5); // Brighter ambient light
          scene.add(ambient);
          
          const moon = new THREE.DirectionalLight(0x8888ff, 0.6); // Brighter moon
          moon.position.set(-10, 10, -5);
          moon.castShadow = true;
          moon.shadow.mapSize.width = 1024; // Reduce shadow map size for performance
          moon.shadow.mapSize.height = 1024;
          moon.shadow.camera.near = 0.5;
          moon.shadow.camera.far = 50;
          scene.add(moon);
          
          // Add fog to enhance the night atmosphere but make it less intense
          scene.fog = new THREE.FogExp2(0x223366, 0.015); // Less dense fog
          
          const blueLight = new THREE.PointLight(0x0022ff, 0.6, 20);
          blueLight.position.set(5, 2, -5);
          scene.add(blueLight);
          
          const houseLight = new THREE.PointLight(0xff9900, 2, 10);
          houseLight.position.set(4, 2, 4);
          houseLight.castShadow = true;
          scene.add(houseLight);
          
          const torch1 = new THREE.PointLight(0xff6600, 1.2, 5);
          torch1.position.set(5, 2.5, 4);
          scene.add(torch1);
          
          const torch2 = new THREE.PointLight(0xff6600, 1.2, 5);
          torch2.position.set(7, 2.5, 4);
          scene.add(torch2);
          
          // Add a soft global fill light to make the scene more visible
          const fillLight = new THREE.HemisphereLight(0x0022aa, 0x002200, 0.3);
          scene.add(fillLight);
        }
      }
      
      buildScene();
      updateTimeOfDay(timeOfDay);
      
      const animate = () => {
        requestAnimationFrame(animate);
        
        // Animate lamp lights if it's night time
        if (timeOfDay === 'night' && lampLights.length > 0) {
          const time = clock.getElapsedTime();
          
          // Create subtle pulsing effect
          lampLights.forEach((light, index) => {
            // Offset each lamp's pulse slightly
            const offset = index * 0.2;
            // Subtle sine wave oscillation for intensity
            const pulseFactor = Math.sin(time * 2 + offset) * 0.15 + 1;
            
            if (light.main) {
              light.main.intensity = light.baseIntensity.main * pulseFactor;
            }
            
            if (light.glow) {
              light.glow.intensity = light.baseIntensity.glow * pulseFactor * 1.2;
            }
            
            if (light.ambient) {
              light.ambient.intensity = light.baseIntensity.ambient * pulseFactor * 0.8;
            }
            
            // Also pulse the glow mesh
            if (light.glowMesh) {
              light.glowMesh.scale.set(
                1 + Math.sin(time * 1.5 + offset) * 0.1,
                1 + Math.sin(time * 1.5 + offset) * 0.1,
                1 + Math.sin(time * 1.5 + offset) * 0.1
              );
              // Adjust opacity slightly
              if (light.glowMesh.material.opacity !== undefined) {
                light.glowMesh.material.opacity = 0.15 + Math.sin(time * 2 + offset) * 0.05;
              }
            }
            
            // Animate the light beams
            if (light.beamUp) {
              light.beamUp.position.y = (light.height + 3.9) + Math.sin(time * 1.2 + offset) * 0.05;
              light.beamUp.material.opacity = 0.08 + Math.sin(time * 1.8 + offset) * 0.03;
              light.beamUp.rotation.z = time * 0.5 + offset;
            }
            
            if (light.beamDown) {
              light.beamDown.position.y = (light.height + 2.7) + Math.sin(time * 1.2 + offset) * 0.05;
              light.beamDown.material.opacity = 0.08 + Math.sin(time * 1.8 + offset) * 0.03;
              light.beamDown.rotation.z = time * 0.5 + offset;
            }
          });
        }
        
        // Animate smoke particles if it's night time
        if (timeOfDay === 'night' && smokeParticles.length > 0) {
          const time = clock.getElapsedTime();
          
          // Update each smoke particle
          for (let i = smokeParticles.length - 1; i >= 0; i--) {
            const smoke = smokeParticles[i];
            
            // Handle chimney smoke
            if (smoke.userData) {
              const userData = smoke.userData;
              
              // Update age
              userData.age += 0.016; // approximate for 60fps
              
              // Move smoke upward and wiggle slightly
              smoke.position.y += userData.speed;
              smoke.position.x += Math.sin(time * 0.5 + i) * userData.wiggle;
              smoke.position.z += Math.cos(time * 0.7 + i) * userData.wiggle;
              
              // Scale up slightly as it rises
              const scaleFactor = 1 + userData.age * 0.05;
              smoke.scale.set(scaleFactor, scaleFactor, scaleFactor);
              
              // Fade out as it ages
              if (userData.age > userData.fadeStart) {
                const fadeRatio = 1 - ((userData.age - userData.fadeStart) / (userData.lifespan - userData.fadeStart));
                smoke.material.opacity = Math.max(0, fadeRatio * 0.2);
              }
              
              // Remove if too old
              if (userData.age > userData.lifespan) {
                scene.remove(smoke);
                smokeParticles.splice(i, 1);
                
                // Create a new smoke particle to replace it
                const smokeGeometry = new THREE.SphereGeometry(Math.random() * 0.15 + 0.05, 8, 8);
                const smokeMaterial = new THREE.MeshBasicMaterial({
                  color: 0x888888,
                  transparent: true,
                  opacity: Math.random() * 0.2 + 0.1
                });
                const newSmoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
                
                // Position at the chimney top - use houseData instead of heightMap
                const offsetX = (Math.random() - 0.5) * 0.2;
                const offsetZ = (Math.random() - 0.5) * 0.2;
                const offsetY = Math.random() * 0.1;
                
                newSmoke.position.set(
                  houseData.x + 5 + offsetX, 
                  houseData.height + 8.5 + offsetY, 
                  houseData.z + 1 + offsetZ
                );
                
                // Set animation properties
                newSmoke.userData = {
                  initialY: houseData.height + 8.5 + offsetY,
                  speed: Math.random() * 0.01 + 0.005,
                  wiggle: Math.random() * 0.01 + 0.003,
                  lifespan: Math.random() * 10 + 5,
                  age: 0,
                  fadeStart: 3
                };
                
                scene.add(newSmoke);
                smokeParticles.push(newSmoke);
              }
            } 
            // Handle water mist (for waterfall, fountain)
            else {
              smoke.age += 0.016;
              
              // Simple rise
              smoke.mesh.position.y += smoke.speed;
              
              // Fade out
              if (smoke.age > smoke.maxAge * 0.3) {
                const fadeRatio = 1 - ((smoke.age - smoke.maxAge * 0.3) / (smoke.maxAge * 0.7));
                smoke.mesh.material.opacity = Math.max(0, fadeRatio * smoke.initialOpacity);
              }
              
              // Reset if too old
              if (smoke.age > smoke.maxAge) {
                smoke.mesh.position.y = smoke.initialY;
                smoke.age = 0;
                smoke.mesh.material.opacity = smoke.initialOpacity;
              }
            }
          }
        }
        
        controls.update();
        renderer.render(scene, camera);
      }
      animate();
      
      setSceneState({ 
        scene, 
        updateTimeOfDay, 
        THREE 
      });
      
      const handleResize = () => {
        const container = canvasRef.current.parentElement;
        if (container) {
          const width = container.clientWidth;
          const height = width;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
      
      window.addEventListener('resize', handleResize);
      handleResize();
      
      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animate);
        renderer.dispose();
      }
    })
    .catch(error => {
      console.error("Failed to initialize Three.js:", error);
    });
    
    return () => {}
  }, [canvasRef]);
  
  useEffect(() => {
    if (sceneState && sceneState.updateTimeOfDay) {
      console.log('Updating environment to:', timeOfDay);
      sceneState.updateTimeOfDay(timeOfDay);
    }
  }, [timeOfDay, sceneState]);
  
  return (
    <div className="w-full aspect-square relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full rounded"
      />
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={toggleTimeOfDay}
          className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded text-white border border-white/20 hover:bg-white/20 transition-colors"
        >
          {timeOfDay === 'day' ? '🌙 Night' : '☀️ Day'}
        </button>
      </div>
    </div>
  );
} 
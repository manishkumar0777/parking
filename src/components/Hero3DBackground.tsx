'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sparkles, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

const AbstractCar = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Holographic glowing base */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.5, 0.4, 5.5]} />
          <meshPhysicalMaterial 
            color="#0f172a" 
            metalness={0.9} 
            roughness={0.1} 
            clearcoat={1} 
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Cabin */}
        <mesh position={[0, 0.5, -0.3]} castShadow>
          <boxGeometry args={[1.8, 0.6, 2.8]} />
          <meshPhysicalMaterial 
            color="#000000" 
            metalness={1} 
            roughness={0} 
            transmission={0.9} 
          />
        </mesh>
        
        {/* Neon Accent Lines (Headlights) */}
        <mesh position={[0, 0, 2.8]}>
          <boxGeometry args={[2, 0.05, 0.05]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={8} toneMapped={false} />
        </mesh>
        
        {/* Taillights */}
        <mesh position={[0, 0, -2.8]}>
          <boxGeometry args={[2, 0.05, 0.05]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={8} toneMapped={false} />
        </mesh>
        
        {/* Side Neon Stripes */}
        <mesh position={[1.26, 0, 0]}>
          <boxGeometry args={[0.02, 0.05, 4]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={4} toneMapped={false} />
        </mesh>
        <mesh position={[-1.26, 0, 0]}>
          <boxGeometry args={[0.02, 0.05, 4]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={4} toneMapped={false} />
        </mesh>
      </Float>
    </group>
  );
};

export default function Hero3DBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [8, 4, 12], fov: 45 }}>
        {/* Dynamic Dark Gradient Background */}
        <color attach="background" args={['#020617']} />
        
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#3b82f6" castShadow />
        <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={2} color="#8b5cf6" castShadow />
        
        <AbstractCar />
        
        {/* Floating Data Particles */}
        <Sparkles count={150} scale={15} size={3} speed={0.4} opacity={0.4} color="#60a5fa" />
        
        <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={30} blur={2.5} far={4} color="#000000" />
        
        <Environment preset="city" />
        
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={2} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

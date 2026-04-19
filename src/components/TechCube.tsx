import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface TechCubeProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const TechCube: React.FC<TechCubeProps> = ({ url, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(url);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Oscillating rotation added to base rotation
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2 + rotation[1];
    groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.5) * 0.2 + rotation[0];
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Glass Cuboid */}
      <mesh>
        <boxGeometry args={[1, 1, 0.5]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.2}
          roughness={0.1}
          transmission={1}
          ior={1.2}
          chromaticAberration={0.02}
          anisotropy={0.1}
        />
      </mesh>

      {/* Internal Logo */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial 
          map={texture} 
          transparent 
          side={THREE.DoubleSide} 
          alphaTest={0.5}
        />
      </mesh>
    </group>
  );
};

export default TechCube;

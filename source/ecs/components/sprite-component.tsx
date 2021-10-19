import { useFrame, useLoader } from '@react-three/fiber';
import { Body } from 'matter-js';
import React, { useRef } from 'react';
import { TextureLoader, Vector3 } from 'three';
import { useTexture } from '@react-three/drei';

import { SpriteComponent } from '../physics-ecs';

import textureMap from './ps_1K_Color.jpg';
import displacementMap from './ps_1K_Displacement.jpg';
import normalMap from './ps_1K_NormalGL.jpg';
import roughnessMap from './ps_1K_Roughness.jpg';
import aoMap from './ps_1K_AmbientOcclusion.jpg';

interface ISpriteComponentProps {
  spriteComponent: SpriteComponent
}

const SpriteComponentRenderer = ({ spriteComponent }: ISpriteComponentProps): React.ReactElement | null => {
  const textures = useTexture({
    map: textureMap,
    displacementMap,
    normalMap,
    roughnessMap,
    aoMap,
  });

  const meshRef = useRef<THREE.Mesh>(null!);
  // const geometryRef = useRef<THREE.BufferGeometry>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current !== null) {
      meshRef.current.rotation.x = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[50, 32, 32]} />
      {/* <boxGeometry args={[100, 100, 100]} /> */}
      <meshStandardMaterial {...textures} />
      {/* <meshStandardMaterial map={textures.map} /> */}
      {/* <meshBasicMaterial color='royalblue' /> */}
    </mesh>
  );
};

export default SpriteComponentRenderer;

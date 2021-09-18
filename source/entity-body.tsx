import { useFrame } from '@react-three/fiber';
import { Body } from 'matter-js';
import React, { useEffect, useRef } from 'react';
import { BufferGeometry, Group } from 'three';

interface IBodyProps {
  body: Body
}

const EntityBody = ({ body }: IBodyProps): React.ReactElement | null => {
  const polyRef = useRef<BufferGeometry>(null!);
  const meshRef = useRef<Group>(null!);
  // const { mutable } = useMutable();

  useFrame(() => {
    meshRef.current.position.set(body.position.x, body.position.y, 0);
  });

  return (
    <mesh ref={meshRef}>
      <meshBasicMaterial color='#09060c' attach='material' />
      <planeGeometry args={[10, 10]} attach='geometry' />
    </mesh>
  );
};

export default EntityBody;

import { useFrame } from '@react-three/fiber';
import { Body } from 'matter-js';
import React, { useEffect, useRef, useState } from 'react';
import { Mesh } from 'three';

const POINT_WIDTH = 2;
const POINT_HEIGHT = 2;

interface IMatterPositionProps {
  body: Body
}


const MatterPosition = ({ body }: IMatterPositionProps): React.ReactElement | null => {
  const meshRef = useRef<Mesh>(null!);

  useFrame(() => {
    meshRef.current.position.set(body.position.x, body.position.y, 0);
  });

  return (
    <mesh ref={meshRef}>
      <meshBasicMaterial color='#611725' attach='material' />
      <planeGeometry args={[POINT_WIDTH, POINT_HEIGHT]} attach='geometry' />
    </mesh>
  );
};

export default MatterPosition;

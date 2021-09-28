import React, { useEffect, useRef } from 'react';
import { BufferGeometry, Group } from 'three';

const POINT_WIDTH = 2;
const POINT_HEIGHT = 2;

interface IPointProps {
  position: [number, number],
}

const Point = ({ position }: IPointProps): React.ReactElement => {
  const polyRef = useRef<BufferGeometry>(null!);
  const meshRef = useRef<Group>(null!);

  useEffect(() => {
    meshRef.current.position.set(position[0], position[1], 0);
  }, [polyRef, position[0], position[1]]);

  return (
    <mesh ref={meshRef}>
      <meshBasicMaterial color='#611725' attach='material' />
      <planeGeometry args={[POINT_WIDTH, POINT_HEIGHT]} attach='geometry' />
    </mesh>
  );
};

export default Point;

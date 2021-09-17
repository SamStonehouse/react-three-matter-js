import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';

interface IBoxProps {
  x?: number,
  y?: number,
  z?: number,
  width: number,
  height: number,
  color?: string | number,
}

const Box = ({ x = 0, y = 0, z = 0, width, height, color = 'white' }: IBoxProps): React.ReactElement => {
  const polyRef = useRef<THREE.BufferGeometry>(null!);

  useEffect(() => {
    const vectorisedPoints = [[0, 0], [width, 0], [width, height], [0, height], [0, 0]].map(([x_, y_]) => new Vector3(x_, y_, 0));
    polyRef.current.setFromPoints(vectorisedPoints);
  }, [polyRef, width, height]);

  return (
    <line_ position={[x, y, z]}>
      <lineBasicMaterial color={color} attach='material' />
      <bufferGeometry attach='geometry' ref={polyRef} />
    </line_>
  );
};

export default Box;

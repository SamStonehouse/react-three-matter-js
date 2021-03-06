import { useFrame } from '@react-three/fiber';
import { Body } from 'matter-js';
import React, { useRef } from 'react';
import { Vector3 } from 'three';

interface IMatterBodyProps {
  body: Body
}

const MatterBody = ({ body }: IMatterBodyProps): React.ReactElement => {
  const lineRef = useRef<THREE.Line>(null!);
  const geometryRef = useRef<THREE.BufferGeometry>(null!);

  useFrame(() => {
    if (geometryRef.current !== null) {
      geometryRef.current.setFromPoints([...body.vertices.map(({ x, y }) => (new Vector3(x, y, 0))), new Vector3(body.vertices[0].x, body.vertices[0].y, 0)]);
    }
  });

  return (
    <line_ ref={lineRef}>
      <lineBasicMaterial color='white' attach='material' />
      <bufferGeometry attach='geometry' ref={geometryRef} />
    </line_>
  );
};

export default MatterBody;

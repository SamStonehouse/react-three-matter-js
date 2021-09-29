import { useFrame } from '@react-three/fiber';
import { Body } from 'matter-js';
import React, { useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';

interface IMatterBoundsProps {
  body: Body,
}

const pointsFromBounds = ([minX, maxX, minY, maxY]) => {
  return [
    new Vector3(minX, minY, 0),
    new Vector3(minX, maxY, 0),
    new Vector3(maxX, maxY, 0),
    new Vector3(maxX, minY, 0),
    new Vector3(minX, minY, 0),
  ];
};

const MatterBounds = ({ body }: IMatterBoundsProps): React.ReactElement | null => {
  const lineRef = useRef<THREE.Line>(null!);
  const geometryRef = useRef<THREE.BufferGeometry>(null!);
  // const { mutable } = useMutable();

  const [[minX, maxX, minY, maxY], setMinMax] = useState([body.bounds.min.x, body.bounds.max.x, body.bounds.min.y, body.bounds.max.y]);

  useFrame(() => {
    if (
      body.bounds.min.x !== minX
      || body.bounds.max.x !== maxX
      || body.bounds.min.y !== minY
      || body.bounds.max.y !== maxY
    ) {
      setMinMax([body.bounds.min.x, body.bounds.max.x, body.bounds.min.y, body.bounds.max.y]);
    }
  });

  useEffect(() => {
    if (geometryRef !== null) {
      geometryRef.current.setFromPoints(pointsFromBounds([minX, maxX, minY, maxY]));
    }
  }, [geometryRef, minX, maxX, minY, maxY]);

  // console.log(pointsFromBounds([minX, maxX, minY, maxY])[0]);

  return (
    <line_ ref={lineRef}>
      <lineBasicMaterial color='blue' attach='material' />
      <bufferGeometry attach='geometry' ref={geometryRef} />
    </line_>
  );
};

export default MatterBounds;

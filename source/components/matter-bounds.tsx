import { useFrame } from '@react-three/fiber';
import { Bounds } from 'matter-js';
import React, { useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';

interface IMatterBoundsProps {
  bounds: Bounds
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

const MatterBounds = ({ bounds }: IMatterBoundsProps): React.ReactElement | null => {
  const lineRef = useRef<THREE.Line>(null!);
  const geometryRef = useRef<THREE.BufferGeometry>(null!);
  // const { mutable } = useMutable();

  const [[minX, maxX, minY, maxY], setMinMax] = useState([bounds.min.x, bounds.max.x, bounds.min.y, bounds.max.y]);

  useFrame(() => {
    if (
      bounds.min.x !== minX
      || bounds.max.x !== maxX
      || bounds.min.y !== minY
      || bounds.max.y !== maxY
    ) {
      setMinMax([bounds.min.x, bounds.max.x, bounds.min.y, bounds.max.y]);
    }
  });

  useEffect(() => {
    if (geometryRef !== null) {
      geometryRef.current.setFromPoints(pointsFromBounds([minX, maxX, minY, maxY]));
    } else {
      console.log('Ref = null');
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

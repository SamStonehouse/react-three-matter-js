import React, { useEffect, useRef, useState } from 'react';
import { Vector3, BufferGeometry, Shape, Vector2 } from 'three';

interface IPolyShapeProps {
  points: [number, number][],
  color?: string,
  line?: boolean,
}

const PolyShape = ({ points, color = '#ffffff', line = false }: IPolyShapeProps): React.ReactElement | null => {
  const polyRef = useRef<BufferGeometry>(null!);

  if (line) {
    useEffect(() => {
      const vectorisedPoints = points.map(([x, y]) => new Vector3(x, y, 0));
      polyRef.current.setFromPoints(vectorisedPoints);
    }, [polyRef, points]);

    return (
      <line_>
        <lineBasicMaterial color={color} attach='material' />
        <bufferGeometry attach='geometry' ref={polyRef} />
      </line_>
    );
  }

  if (points.length < 2) {
    return null;
  }

  const shape = new Shape(points.map(([x, y]) => new Vector2(x, y)));

  return (
    <mesh>
      <meshBasicMaterial color={color} attach='material' />
      <shapeGeometry attach='geometry' args={[shape]} />
    </mesh>
  );
};

export default PolyShape;

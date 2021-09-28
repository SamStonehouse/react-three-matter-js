import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import { Group } from 'three';

import { useMutable } from '@/mutable-state';

interface IPhysicsECSEntityProps {
  entityId: number
}

const PhysicsECSEntity = ({ entityId }: IPhysicsECSEntityProps): React.ReactElement | null => {
  const meshRef = useRef<Group>(null!);
  const { mutable } = useMutable();

  useFrame(() => {
    if (mutable.ecs !== null) {
      const { position } = mutable.ecs.componentLists.transform.components[mutable.ecs.componentLists.transform.entityIndex[entityId]].data;
      meshRef.current.position.set(...position);
    }
  });

  return (
    <mesh ref={meshRef}>
      <meshBasicMaterial color='#09060c' attach='material' />
      <planeGeometry args={[10, 10]} attach='geometry' />
    </mesh>
  );
};

export default PhysicsECSEntity;

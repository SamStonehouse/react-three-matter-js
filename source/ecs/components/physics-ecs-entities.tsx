import { useFrame } from '@react-three/fiber';
import React, { useRef, useState } from 'react';

import { useMutable } from '@/mutable-state';
import { Entity, hasNewEntites } from '../simple-ecs';
import PhysicsECSEntity from './physics-ecs-entity';

interface IPhysicsECSEntitiesProps {

}

type LastFrameData = {
  length: number,
  lastEntityId: number | null,
}

const PhysicsECSEntities = ({ }: IPhysicsECSEntitiesProps): React.ReactElement | null => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const { mutable } = useMutable();

  const lastFrameData = useRef<LastFrameData>({
    length: 0,
    lastEntityId: null,
  });

  useFrame(() => {
    if (mutable.ecs !== null) {
      if (hasNewEntites(mutable.ecs.entities, lastFrameData.current.length, lastFrameData.current.lastEntityId)) {
        setEntities(mutable.ecs.entities);
      }
    }
  });

  return (
    <>
      {entities.map((entity, i) => <PhysicsECSEntity key={i} entityId={entity.id} />)}
    </>
  );
};

export default PhysicsECSEntities;

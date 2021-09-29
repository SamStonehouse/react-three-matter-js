import React, { useRef } from 'react';
import { Body } from 'matter-js';

import { useMutable } from '@/mutable-state';

import { PhysicsECS } from '../physics-ecs';

import MatterBody from './matter-body';
import MatterBounds from './matter-bounds';
import MatterPosition from './matter-position';

interface IPhysicsECSEntityProps {
  entityId: number
}

function getBodyFromECS(ecs: null | PhysicsECS, entityId): null | Body {
  if (ecs !== null) {
    const componentIndex = ecs.componentLists.rigidBody.entityIndex[entityId];
    if (componentIndex === undefined) {
      return null;
    }

    return ecs.componentLists.rigidBody.components[componentIndex].data.body;
  }

  return null;
}

const PhysicsECSEntity = ({ entityId }: IPhysicsECSEntityProps): React.ReactElement | null => {
  const { mutable } = useMutable();
  const body = useRef<null | Body>(getBodyFromECS(mutable.ecs, entityId));

  if (body.current === null) {
    return null;
  }

  return (
    <>
      <MatterBody body={body.current} />
      <MatterBounds body={body.current} />
      <MatterPosition body={body.current} />
    </>
  );
};

export default PhysicsECSEntity;

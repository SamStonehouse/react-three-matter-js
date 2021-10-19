import React, { useRef } from 'react';
import { Body } from 'matter-js';

import { useMutable } from '@/mutable-state';

import { PhysicsECS, PhysicsECSComponentTypes, SpriteComponent } from '../physics-ecs';

import MatterBody from './matter-body';
import MatterBounds from './matter-bounds';
import MatterPosition from './matter-position';
import SpriteComponentRenderer from './sprite-component';
import { getComponent } from '../../simple-ecs-framework/simple-ecs-framework';

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
  if (mutable.ecs === null) {
    return null;
  }

  const body = useRef<null | Body>(getBodyFromECS(mutable.ecs, entityId));
  const sprite = useRef<null | SpriteComponent>(getComponent(mutable.ecs, entityId, PhysicsECSComponentTypes.sprite));

  if (body.current === null) {
    return null;
  }

  return (
    <>
      <MatterBody body={body.current} />
      <MatterBounds body={body.current} />
      <MatterPosition body={body.current} />
      { sprite.current === null ? null : <SpriteComponentRenderer spriteComponent={sprite.current} /> }
    </>
  );
};

export default PhysicsECSEntity;

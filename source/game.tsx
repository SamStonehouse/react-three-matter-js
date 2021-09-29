import React, { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Composite } from 'matter-js';

import World from './world';
import { useMutable } from './mutable-state';
import { GameConfiguration, useStore } from './store';
import { createEntityFromObject, createPhysicsECS } from './ecs/physics-ecs';
import { addEntity, runTasks } from './ecs/simple-ecs';


const Game = (): React.ReactElement => {
  const { mutable } = useMutable();
  const configuration = useStore<GameConfiguration>((state) => state.configuration);

  useEffect(() => {
    mutable.ecs = createPhysicsECS(mutable.engine);
    configuration.entities.map(createEntityFromObject).forEach(([name, componentData]) => {
      if (mutable.ecs !== null) {
        const entityId = addEntity(mutable.ecs, name, componentData);
        const componentIndex = mutable.ecs.componentLists.rigidBody.entityIndex[entityId];
        if (componentIndex !== undefined) {
          // RigidBody component was added, add it to physics engine
          // TODO: Do this as part of component initialisation?
          Composite.add(
            mutable.engine.world,
            mutable.ecs.componentLists.rigidBody.components[componentIndex].data.body,
          );
        }
      }
    });
    mutable.engine.gravity.y = -1;
  });

  useFrame(({ gl, scene, camera }) => gl.render(scene, camera), 1000);

  useFrame((state, delta) => {
    if (mutable.ecs !== null) {
      runTasks(mutable.ecs, { delta });
    }
  }, 1);

  return (
    <>
      <World />
    </>
  );
};

export default Game;

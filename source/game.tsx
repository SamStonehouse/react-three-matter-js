import React, { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Body, Bodies, Engine, Composite } from 'matter-js';

import World from './world';
import { useMutable } from './mutable-state';
import { GameConfiguration, useStore } from './store';
import EntityBodies from './entity-bodies';
import { createEntityFromTemplate, createPhysicsECS } from './ecs/phsyics-ecs';
import { addEntity, runTasks } from './ecs/simple-ecs';


function createEntityBody([x, y], width, height): Body {
  const w = width / 2;
  const h = height / 2;
  return Bodies.fromVertices(x, y, [[{ x: -w, y: h }, { x: -w, y: -h }, { x: w, y: -h }, { x: w, y: h }]]);
}

const Game = (): React.ReactElement => {
  const { mutable } = useMutable();
  const configuration = useStore<GameConfiguration>((state) => state.configuration);

  useEffect(() => {
    mutable.ecs = createPhysicsECS(mutable.engine);
    configuration.entities.map(createEntityFromTemplate).forEach(([name, componentData]) => {
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

  // useEffect(() => {
  //   // Add mutable entity bodies to mutable state
  //   mutable.staticBodies = configuration.staticBodies.map((staticBody) => Bodies.fromVertices(0, 0, [staticBody.map((vec) => ({ x: vec[0], y: vec[1] }))])).map((body) => { body.isStatic = true; return body; });
  //   mutable.entityBodies = configuration.entityBodies.map((entityBody) => createEntityBody([entityBody[0], entityBody[1]], 10, 10));

  //   // Add static bodies to the world
  //   Composite.add(
  //     mutable.engine.world,
  //     mutable.staticBodies,
  //   );

  //   Composite.add(
  //     mutable.engine.world,
  //     mutable.entityBodies,
  //   );

  //   mutable.engine.gravity.y = -0.2;
  //   console.log(mutable.engine);
  // }, []);

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

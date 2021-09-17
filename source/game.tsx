import React, { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Bodies, Engine, Composite } from 'matter-js';

import World from './world';
import { useMutable } from './mutable-state';
import { GameConfiguration, useStore } from './store';


function createEntityBody([x, y], width, height) {
  const w = width / 2;
  const h = height / 2;
  return Bodies.fromVertices(x, y, [[{ x: -w, y: h }, { x: -w, y: -h }, { x: w, y: -h }, { x: w, y: h }]]);
}

const Game = (): React.ReactElement => {
  const { mutable } = useMutable();
  const configuration = useStore<GameConfiguration>((state) => state.configuration);


  useEffect(() => {
    // Add static bodies to the world
    Composite.add(
      mutable.engine.world,
      // eslint-disable-next-line no-param-reassign
      configuration.staticBodies.map((staticBody) => Bodies.fromVertices(0, 0, [staticBody.map((vec) => ({ x: vec[0], y: vec[1] }))])).map((body) => { body.isStatic = true; return body; }),
    );

    // Add mutable entity bodies to mutable state
    mutable.entityBodies = configuration.entityBodies.map((entityBody) => createEntityBody([entityBody[0], entityBody[1]], 10, 10));

    Composite.add(
      mutable.engine.world,
      mutable.entityBodies,
    );

    mutable.engine.gravity.y = -1;
  }, []);

  useFrame(({ gl, scene, camera }) => gl.render(scene, camera), 1000);

  useFrame((state, delta) => {
    console.log('Updating physics engine');
    Engine.update(mutable.engine, delta * 1000);
  }, 1);

  return (
    <World />
  );
};

export default Game;

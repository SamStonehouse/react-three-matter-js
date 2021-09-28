import React, { useState } from 'react';
import { Body } from 'matter-js';
import { useFrame } from '@react-three/fiber';

import { GameConfiguration, useStore } from './store';
import { useMutable } from './mutable-state';

import PolyShape from './components/poly-shape';
import MatterBody from './components/matter-body';
import PhysicsECSEntities from './ecs/physics-ecs-entities';

const World = (): React.ReactElement => {
  const configuration = useStore<GameConfiguration>((state) => state.configuration);
  const { mutable } = useMutable();

  const [staticBodies, setStaticBodies] = useState<Body[]>([]);
  const [entityBodies, setEntityBodies] = useState<Body[]>([]);

  useFrame(() => {
    if (mutable.staticBodies !== staticBodies) {
      setStaticBodies(mutable.staticBodies);
    }

    if (mutable.entityBodies !== entityBodies) {
      setEntityBodies(mutable.entityBodies);
    }
  });

  // For now, the world doesn't change so this is fine
  return (
    <>
      {/* {configuration.staticBodies.map((staticBody, i) => <PolyShape key={i} points={[...staticBody, staticBody[0]]} />)} */}
      {/* {staticBodies.map((staticBody, i) => <MatterBody key={i} body={staticBody} />)}
      {entityBodies.map((body, i) => <MatterBody body={body} key={i} />)} */}
      <PhysicsECSEntities />
    </>
  );
};

export default World;

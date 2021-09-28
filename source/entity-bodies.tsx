import { useFrame } from '@react-three/fiber';
import { Body } from 'matter-js';
import React, { useEffect, useRef, useState } from 'react';
import { Vector3, BufferGeometry, Shape, Vector2 } from 'three';
import MatterBounds from './components/matter-bounds';
import EntityBody from './entity-body';
import MatterBody from './components/matter-body';
import { useMutable } from './mutable-state';
import { GameConfiguration, useStore } from './store';
import MatterPosition from './components/matter-position';

const EntityBodies = (): React.ReactElement | null => {
  const { mutable } = useMutable();
  const configuration = useStore<GameConfiguration>((state) => state.configuration);

  const [entityBodies, setEntityBodies] = useState<Body[]>([]);

  useFrame(() => {
    if (mutable.entityBodies !== entityBodies) {
      setEntityBodies(mutable.entityBodies);
    }
  });

  return (
    <>
      {entityBodies.map((body, i) => <MatterBody body={body} key={i} />)}
      {/* {entityBodies.map((body, i) => <MatterBounds bounds={body.bounds} key={i} />)}
      {entityBodies.map((body, i) => <MatterPosition body={body} key={i} />)} */}
    </>
  );
};

export default EntityBodies;

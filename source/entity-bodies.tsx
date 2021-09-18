import { useFrame } from '@react-three/fiber';
import { Body } from 'matter-js';
import React, { useEffect, useRef, useState } from 'react';
import { Vector3, BufferGeometry, Shape, Vector2 } from 'three';
import EntityBody from './entity-body';
import { useMutable } from './mutable-state';
import { GameConfiguration, useStore } from './store';

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
      {entityBodies.map((body, i) => <EntityBody body={body} key={i} />)}
    </>
  );
};

export default EntityBodies;

import React from 'react';
import { GameConfiguration, useStore } from './store';
import PolyShape from './components/poly-shape';

const World = (): React.ReactElement => {
  const configuration = useStore<GameConfiguration>((state) => state.configuration);

  // For now, the world doesn't change so this is fine
  return (
    <>
      {configuration.staticBodies.map((staticBody, i) => <PolyShape key={i} points={[...staticBody, staticBody[0]]} />)}
    </>
  );
};

export default World;

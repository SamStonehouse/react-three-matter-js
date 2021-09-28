import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';

import { MutableProvider } from './mutable-state';
import Game from './game';

import styles from './app.scss';

const App = (): React.ReactElement => (
  <Canvas className={styles.threeCanvas}>
    <MutableProvider>
      <OrthographicCamera zoom={1} position={[0, 0, 100]} makeDefault />
      <Game />
    </MutableProvider>
  </Canvas>
);

export default App;

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei';

import { MutableProvider } from './mutable-state';
import Game from './game';

import styles from './app.scss';
import ZeroZero from './zero-zero';

const App = (): React.ReactElement => (
  <Canvas className={styles.threeCanvas}>
    <Suspense fallback={null}>
      <MutableProvider>
        <ambientLight intensity={0.2} />
        <OrthographicCamera zoom={1} position={[0, 0, 100]} makeDefault />
        {/* <PerspectiveCamera zoom={1} position={[0, 0, 100]} makeDefault /> */}
        <Game />
        <ZeroZero />
      </MutableProvider>
    </Suspense>
  </Canvas>
);

export default App;

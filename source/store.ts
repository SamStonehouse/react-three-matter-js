import create from 'zustand';
import shallow from 'zustand/shallow';

import type { GetState, SetState, StateSelector } from 'zustand';
import { PhysicsECSEntityEmplate } from './ecs/phsyics-ecs';

export type GameConfiguration = {
  width: number,
  height: number,
  staticBodies: [number, number][][],
  entityBodies: [number, number][],
  entities: PhysicsECSEntityEmplate[]
};

const DEFAULT_CONFIGURATION: GameConfiguration = {
  width: 400,
  height: 400,
  staticBodies: [
    [
      [200, 0],
      [-200, 0],
      [-200, -20],
      [200, -20],
    ],
  ],
  entityBodies: [
    [0, 100],
    [-2, 140],
    [-5, 180],
    [-5, 180],
    [-5, 180],
    [-5, 180],
    [-5, 180],
    [-5, 180],
  ],
  entities: [
    {
      name: 'A',
      transform: {
        position: [0, 0, 0],
        angle: 0,
      },
      rigidBody: {
        points: [
          [5, 5],
          [-5, 5],
          [-5, -5],
          [5, -5],
        ],
        isStatic: false,
      },
    },
    {
      name: 'B',
      transform: {
        position: [0, -450, 0],
        angle: 0,
      },
      rigidBody: {
        points: [
          [200, 0],
          [-200, 0],
          [-200, -20],
          [200, -20],
        ],
        isStatic: true,
      },
    },
  ],
};

export type Getter = GetState<IState>
export type Setter = SetState<IState>

export interface IState {
  get: Getter
  set: Setter
  configuration: GameConfiguration,
}

const useStoreImpl = create<IState>((set: SetState<IState>, get: GetState<IState>) => {
  return {
    configuration: DEFAULT_CONFIGURATION,
    get,
    set,
  };
});

// Make the store shallow compare by default
const useStore = <T>(sel: StateSelector<IState, T>): T => useStoreImpl(sel, shallow);

Object.assign(useStore, useStoreImpl);

const { getState, setState } = useStoreImpl;

export { getState, setState, useStore };

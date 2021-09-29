import { Engine, Body } from 'matter-js';
import { PhysicsECS } from './ecs/physics-ecs';
import { createMutable } from './utils/mutable-state-provider';

interface MutableState {
  engine: Engine;
  entityBodies: Body[];
  staticBodies: Body[];
  ecs: PhysicsECS | null,
}

const {
  MutableContext,
  MutableProvider,
  useMutable,
} = createMutable<MutableState>({
  engine: Engine.create(),
  entityBodies: [],
  staticBodies: [],
  ecs: null,
});

export {
  MutableContext,
  MutableProvider,
  useMutable,
};

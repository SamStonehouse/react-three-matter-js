import { Engine, Body } from 'matter-js';
import { createMutable } from './utils/mutable-state-provider';

interface MutableState {
  engine: Engine;
  entityBodies: Body[];
}

const {
  MutableContext,
  MutableProvider,
  useMutable,
} = createMutable<MutableState>({
  engine: Engine.create(),
  entityBodies: [],
});

export {
  MutableContext,
  MutableProvider,
  useMutable,
};

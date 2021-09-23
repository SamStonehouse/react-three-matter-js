import { ComponentList, ComponentsLists, createComponentList, createECS } from './simple-ecs';

export enum PhysicsECSComponentTypes {
  transform = 'transform',
  rigidBody = 'rigidBody',
}

export interface TransformComponent {
  type: PhysicsECSComponentTypes.transform,
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface RigidBodyComponent {
  type: PhysicsECSComponentTypes.rigidBody,
  body: Body,
}

interface PhysicsECSComponents extends ComponentsLists {
  [PhysicsECSComponentTypes.transform]: ComponentList<TransformComponent>;
  [PhysicsECSComponentTypes.rigidBody]: ComponentList<RigidBodyComponent>;
}

type PhysicsECSState = Record<string, never>;

const a = createECS<PhysicsECSComponents, PhysicsECSState>({}, {
  [PhysicsECSComponentTypes.transform]: createComponentList<TransformComponent>(),
  [PhysicsECSComponentTypes.rigidBody]: createComponentList<RigidBodyComponent>(),
});

a.componentLists.
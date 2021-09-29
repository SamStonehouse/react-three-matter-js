import { Bodies, Body, Engine } from 'matter-js';
import { addTask, ComponentData, ComponentList, ComponentsLists, createComponentList, createECS, ECS, Entity } from './simple-ecs';

export type PhysicsECS = ECS<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameOpts>;

export enum PhysicsECSComponentTypes {
  transform = 'transform',
  rigidBody = 'rigidBody',
  userControlled = 'userControlled',
}
export type TransformComponent = {
  type: PhysicsECSComponentTypes.transform,
  position: [number, number, number];
  angle: number,
}

export type RigidBodyComponent = {
  type: PhysicsECSComponentTypes.rigidBody,
  body: Body,
}

export type PhysicsECSFrameOpts = {
  delta: number,
}

// export interface UserControlledComponent {
//   type: PhysicsECSComponentTypes.userControlled,
// }
export interface PhysicsECSComponents extends ComponentsLists {
  [PhysicsECSComponentTypes.transform]: ComponentList<TransformComponent>;
  [PhysicsECSComponentTypes.rigidBody]: ComponentList<RigidBodyComponent>;
}

type ECSInputs = {
  forward: boolean,
  backward: boolean,
  left: boolean,
  right: boolean,
}

type PhysicsECSState = {
  engine: Engine,
  inputs: ECSInputs,
}

/**
 * Upate physics engine and then update transforms of all entites which have physics, this should be done after the physics engine updates
 */
const updateTransformFromPhysics = (ecs: PhysicsECS): void => {
  const rigidBodyComponents = ecs.componentLists.rigidBody.components;

  for (let i = 0; i < rigidBodyComponents.length; i++) {
    const rbc = rigidBodyComponents[i];
    const transformIndex = ecs.componentLists.transform.entityIndex[rbc.entityId];
    if (transformIndex !== undefined) {
      const { data } = ecs.componentLists.transform.components[transformIndex];
      data.position[0] = rbc.data.body.position.x;
      data.position[1] = rbc.data.body.position.y;
      data.angle = rbc.data.body.angle;
    }
  }
};

const updateEngine = (ecs: PhysicsECS, { delta }: PhysicsECSFrameOpts): void => {
  Engine.update(ecs.state.engine, delta * 1000);
};

/**
 * Upate physics engine positions and rotation from transforms, this should be done before the physics engine updates
 */
const updatePhysicsFromTransform = (ecs: PhysicsECS): void => {
  const rigidBodyComponents = ecs.componentLists.rigidBody.components;

  for (let i = 0; i < rigidBodyComponents.length; i++) {
    const rbc = rigidBodyComponents[i];
    const transformIndex = ecs.componentLists.transform.entityIndex[rbc.entityId];
    if (transformIndex !== undefined) {
      const { data } = ecs.componentLists.transform.components[transformIndex];
      const [x, y] = data.position;
      rbc.data.body.position.x = x;
      rbc.data.body.position.y = y;
      rbc.data.body.angle = data.angle;
    }
  }
};

/**
 * Upate physics engine and then update transforms of all entites which have physics
 */
const processInputs = (ecs: PhysicsECS): void => {
  const { forward, backward, left, right } = ecs.state.inputs;

  const userControlledComponentList = ecs.componentLists.userControlled.components;
  const rigidBodyComponents = ecs.componentLists.rigidBody;

  for (let i = 0; i < userControlledComponentList.length; i++) {
    const ucc = userControlledComponentList[i];
    const rigidBodyIndex = rigidBodyComponents.entityIndex[ucc.entityId];
    if (rigidBodyIndex !== undefined) {
      const rigidBodyComponent = ecs.componentLists.rigidBody.components[rigidBodyIndex];

      if (forward) {
        Body.applyForce(rigidBodyComponent.data.body, { x: 0, y: 0 }, { x: 1, y: 0 });
      }

      if (backward) {
        Body.applyForce(rigidBodyComponent.data.body, { x: 0, y: 0 }, { x: -1, y: 0 });
      }

      if (left) {
        Body.rotate(rigidBodyComponent.data.body, 0.1);
      }

      if (right) {
        Body.rotate(rigidBodyComponent.data.body, 0.1);
      }
    }
  }
};

export function createPhysicsECS(engine: Engine): PhysicsECS {
  const physicsECS = createECS<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameOpts>(
    {
      engine,
      inputs: {
        forward: false,
        backward: false,
        left: false,
        right: false,
      },
    },
    {
      [PhysicsECSComponentTypes.transform]: createComponentList<TransformComponent>(),
      [PhysicsECSComponentTypes.rigidBody]: createComponentList<RigidBodyComponent>(),
    },
  );

  addTask<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameOpts>(physicsECS, 'Physics update from transform', updatePhysicsFromTransform, 2);
  addTask<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameOpts>(physicsECS, 'Phyics update', updateEngine, 2);
  addTask<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameOpts>(physicsECS, 'Transform update from physics', updateTransformFromPhysics, 2);

  return physicsECS;
}

export type PhysicsECSEntityEmplate = {
  name: string,
  transform: {
    position: [number, number, number];
    angle: number,
  },
  rigidBody?: {
    points: [number, number][],
    isStatic: boolean,
  },
}

export function createEntityFromTemplate(template: PhysicsECSEntityEmplate): [string, Array<ComponentData>] {
  const { position, angle } = template.transform;

  const components: Array<TransformComponent | RigidBodyComponent> = [
    {
      type: PhysicsECSComponentTypes.transform,
      position: [position[0], position[1], position[2]],
      angle,
    },
  ];

  if (template.rigidBody) {
    const { isStatic, points } = template.rigidBody;
    components.push({
      type: PhysicsECSComponentTypes.rigidBody,
      body: Bodies.fromVertices(
        position[0],
        position[1],
        [points.map((vec) => ({ x: vec[0], y: vec[1] }))],
        { angle, isStatic },
      ),
    });
  }

  return [
    template.name,
    components,
  ];
}

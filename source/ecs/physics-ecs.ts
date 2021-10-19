import { Bodies, Body, Engine } from 'matter-js';
import { addTask, ComponentData, ComponentList, ComponentsLists, createComponentList, createECS, ECS, Entity, Task, TaskProcess } from '../simple-ecs-framework/simple-ecs-framework';

export type PhysicsECS = ECS<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameData>;

export enum PhysicsECSComponentTypes {
  transform = 'transform',
  rigidBody = 'rigidBody',
  userControlled = 'userControlled',
  sprite = 'sprite',
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

export type UserControlledComponent = {
  type: PhysicsECSComponentTypes.userControlled,
}

export type PhysicsECSFrameData = {
  delta: number,
}

export type Sprite = {
  file: string,
  position: [number, number, number],
  rotation: number,
}

export type SpriteComponent = {
  type: PhysicsECSComponentTypes.sprite,
  sprites: Sprite[],
}

export interface PhysicsECSComponents extends ComponentsLists {
  [PhysicsECSComponentTypes.transform]: ComponentList<TransformComponent>;
  [PhysicsECSComponentTypes.rigidBody]: ComponentList<RigidBodyComponent>;
  [PhysicsECSComponentTypes.userControlled]: ComponentList<UserControlledComponent>;
  [PhysicsECSComponentTypes.sprite]: ComponentList<SpriteComponent>;
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
 * Update physics engine and then update transforms of all entites which have physics, this should be done after the physics engine updates
 */
const updateTransformFromPhysics: TaskProcess<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameData> = (ecs: PhysicsECS): void => {
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

const updateEngine: TaskProcess<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameData> = (ecs: PhysicsECS, { delta }: PhysicsECSFrameData): void => {
  Engine.update(ecs.state.engine, delta * 1000);
};

/**
 * Update physics engine positions and rotation from transforms, this should be done before the physics engine updates
 */
const updatePhysicsFromTransform: TaskProcess<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameData> = (ecs: PhysicsECS): void => {
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
 * Update physics engine and then update transforms of all entites which have physics
 *
 * @param ecs PhysicsECS
 */
const processInputs: TaskProcess<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameData> = (ecs: PhysicsECS): void => {
  const { forward, backward, left, right } = ecs.state.inputs;

  const userControlledComponentList = ecs.componentLists.userControlled.components;
  const rigidBodyComponents = ecs.componentLists.rigidBody;

  for (let i = 0; i < userControlledComponentList.length; i++) {
    const ucc = userControlledComponentList[i];
    const rigidBodyIndex = rigidBodyComponents.entityIndex[ucc.entityId];

    if (rigidBodyIndex !== undefined) {
      const rigidBodyComponent = ecs.componentLists.rigidBody.components[rigidBodyIndex];
      const { body } = rigidBodyComponent.data;
      const direction = [Math.cos(body.angle), Math.sin(rigidBodyComponent.data.body.angle)];

      const V = 0.0001;

      if (forward) {
        Body.applyForce(body, body.position, { x: direction[0] * V, y: direction[1] * V });
      }

      if (backward) {
        Body.applyForce(body, body.position, { x: -direction[0] * V, y: -direction[1] * V });
      }

      if (left) {
        Body.rotate(body, 0.1);
      }

      if (right) {
        Body.rotate(body, -0.1);
      }
    }
  }
};

/**
 * Creates a new PhysicsECS with the given Matter-JS engine
 *
 * @param engine Matter-JS engine
 * @returns the created PhysicsECS
 */
export function createPhysicsECS(engine: Engine): PhysicsECS {
  const physicsECS = createECS<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameData>(
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
      [PhysicsECSComponentTypes.userControlled]: createComponentList<UserControlledComponent>(),
      [PhysicsECSComponentTypes.sprite]: createComponentList<SpriteComponent>(),
    },
  );

  addTask<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameData>(physicsECS, 'Physics update from transform', updatePhysicsFromTransform, 4);
  addTask<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameData>(physicsECS, 'Update from inputs', processInputs, 3);
  addTask<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameData>(physicsECS, 'Phyics engine update', updateEngine, 2);
  addTask<PhysicsECSComponents, PhysicsECSState, PhysicsECSFrameData>(physicsECS, 'Transform update from physics', updateTransformFromPhysics, 1);

  return physicsECS;
}


export type PhysicsECSEntityData = {
  name: string,
  transform: {
    position: [number, number, number];
    angle: number,
  },
  rigidBody?: {
    points: [number, number][],
    isStatic: boolean,
  },
  userControlled?: boolean,
  sprite?: {
    file: string,
  }
}

/**
 * Returns a tuple with an entity name and an array of ComponentData
 *
 * @param entityData
 * @returns [objectName, entityComponents[]]
 */
export function createEntityFromData(entityData: PhysicsECSEntityData): [string, Array<ComponentData>] {
  const { position, angle } = entityData.transform;

  const components: Array<TransformComponent | RigidBodyComponent | UserControlledComponent | SpriteComponent> = [
    {
      type: PhysicsECSComponentTypes.transform,
      position: [position[0], position[1], position[2]],
      angle,
    },
  ];

  if (entityData.rigidBody) {
    const { isStatic, points } = entityData.rigidBody;
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

  if (entityData.userControlled) {
    components.push({
      type: PhysicsECSComponentTypes.userControlled,
    });
  }

  if (entityData.sprite) {
    const { file } = entityData.sprite;
    components.push({
      type: PhysicsECSComponentTypes.sprite,
      sprites: [
        { file, position: [0, 0, 0], rotation: 0 },
      ],
    });
  }

  return [
    entityData.name,
    components,
  ];
}

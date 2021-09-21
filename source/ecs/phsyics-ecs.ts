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

// const createEntity = (ecs: ECS<PhysicsECSComponents>, name: string, components: (TransformComponent|RigidBodyComponent)[]): void => {
//   const entityId = 0;

//   // Create new Entity entry
//   ecs.entities.push({
//     id: entityId,
//     name,
//   });

//   // Add components
//   for (let i = 0; i < components.length; i++) {
//     addComponentToComponentList(ecs.componentLists[components[i].type], { entityId, data: components[i] });
//   }
// };

// const removeEntity = (ecs: ECS<PhysicsECSComponents>) => (entityId: number): void => {
//   removeComponent(ecs.componentLists.transformComponents, entityId);
//   removeComponent(ecs.componentLists.rigidBodyComponents, entityId);
// }

const anECS: ECS<PhysicsECSComponents> = {

  entities: [],
  componentLists: {
    transform: {
      components: [],
      componentIndex: {},
    },
    rigidBody: {
      components: [],
      componentIndex: {},
    },
  },
};
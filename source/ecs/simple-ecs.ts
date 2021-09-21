/* eslint-disable no-param-reassign */
export type Entity = {
  id: number,
  name: string,
}

export interface ComponentData {
  type: string,
}

export interface Component<T extends ComponentData> {
  entityId: number,
  componentId: number,
  data: T,
}

export interface ComponentList<T extends ComponentData> {
  components: Component<T>[],
  componentIndex: Record<number, number>, // ComponentID -> Component Index[]
}

export type ComponentsLists = Record<string, ComponentList<ComponentData>>;

export type Task<T extends ComponentsLists, U> = {
  name: string,
  run(ecs: ECS<T, U>): void,
  priority: number,
}

export type ECS<T extends ComponentsLists, U> = {
  entityId: number,
  componentId: number,
  entities: Entity[],
  componentLists: T,
  tasks: Task<T, U>[],
  state: U,
}

export function addComponent<T extends ComponentsLists, U extends ComponentData>(ecs: ECS<T, any>, entityId: number, data: U): number {
  const componentId = ecs.componentId++;
  ecs.componentLists[data.type].components.push({ entityId, componentId, data });
  ecs.componentLists[data.type].componentIndex[componentId] = ecs.componentLists[data.type].components.length - 1;
  return componentId;
}

export function addEntity<T extends ComponentsLists, U extends ComponentData>(ecs: ECS<T, any>, name: string, componentData: U[]): number {
  const entityId = ecs.entityId++;
  ecs.entities.push({ id: entityId, name });
  for (let i = 0; i < componentData.length; i++) {
    addComponent(ecs, entityId, componentData[i]);
  }
  return entityId;
}

export function addTask<T extends ComponentsLists, U>(ecs: ECS<T, U>, name: string, run: (ecs: ECS<T, U>) => void, priority: number = 0): void {
  ecs.tasks.push({
    name,
    run,
    priority,
  });

  ecs.tasks.sort((a, b) => {
    return b.priority - a.priority;
  });
}

// TODO
function createECS<T extends ComponentsLists, U>(initialState: U): ECS<T, U> {
  const ecs = {};

  return {
    entities: [],
    componentLists: {},
    tasks: [],
    state: initialState,
  };
}

/**
 * A Simple Entity-Component System, designed to encapsulate state and logic
 * for a dynamic system by storing common state as components, and linking them together via an 'entity'.
 *
 * SimpleECS adds additional functionality in the form of
 * - State, to store global items, not specific to a given entity
 * - Tasks, run each frame, they are the logic holders which update components with new values
 */
export type Entity = {
  id: number,
  name: string,
  componentTypes: string[],
}

export interface ComponentData {
  type: string,
}

export interface Component<T extends ComponentData> {
  entityId: number,
  data: T,
}

export interface ComponentList<T extends ComponentData> {
  components: Component<T>[],
  entityIndex: Record<number, number>, // EntityID -> Component Index[]
}

export type ComponentsLists = Record<string, ComponentList<ComponentData>>;

export type Task<T extends ComponentsLists, U> = {
  name: string,
  run(ecs: ECS<T, U>): void,
  priority: number,
}

export type ECS<T extends ComponentsLists, U> = {
  entityId: number,
  entities: Entity[],
  entitiesById: Record<string, number>,
  componentLists: T,
  tasks: Task<T, U>[],
  state: U,
}

export function addComponent<T extends ComponentsLists, U extends ComponentData>(ecs: ECS<T, any>, entityId: number, data: U): void {
  console.log('Adding component');
  ecs.componentLists[data.type].components.push({ entityId, data });
  ecs.componentLists[data.type].entityIndex[entityId] = ecs.componentLists[data.type].components.length - 1;
}

export function addEntity<T extends ComponentsLists>(ecs: ECS<T, any>, name: string, componentData: ComponentData[]): number {
  console.log('Adding entity');
  const entityId = ecs.entityId++;

  const componentTypes = componentData.reduce<string[]>((acc, val) => {
    acc.push(val.type);
    return acc;
  }, []);

  ecs.entities.push({ id: entityId, name, componentTypes });
  ecs.entitiesById[entityId] = ecs.entities.length - 1;

  for (let i = 0; i < componentData.length; i++) {
    addComponent(ecs, entityId, componentData[i]);
  }

  return entityId;
}

export function removeComponentByEntityId(componentList: ComponentList<ComponentData>, entityId: number): boolean {
  const index = componentList.entityIndex[entityId];
  if (index === undefined) {
    // No such component with this ID in this list
    return false;
  }

  componentList.components.splice(index, 1);
  delete componentList.entityIndex[entityId];

  // Update indexes for all components which are after this one
  for (let i = index; i < componentList.components.length; i++) {
    componentList.entityIndex[componentList.components[i].entityId] = i;
  }

  return true;
}

export function removeEntity<T extends ComponentsLists>(ecs: ECS<T, any>, entityId: number): boolean {
  const index = ecs.entitiesById[entityId];

  if (index === undefined) {
    return false;
  }

  const entity = ecs.entities[index];

  if (entity === undefined) {
    return false;
  }

  for (let i = 0; i < entity.componentTypes.length; i++) {
    removeComponentByEntityId(ecs.componentLists[entity.componentTypes[i]], entityId);
  }

  ecs.entities.splice(index, 1);
  delete ecs.entitiesById[entityId];

  // Update indexes for all entites which are after this one
  for (let i = index; i < ecs.entities.length; i++) {
    ecs.entitiesById[ecs.entities[i].id] = i;
  }

  return true;
}

export function createComponentList<T extends ComponentData>(): ComponentList<T> {
  return {
    components: [],
    entityIndex: {},
  };
}

export function addTask<T extends ComponentsLists, U>(ecs: ECS<T, U>, name: string, run: (ecs: ECS<T, U>) => void, priority: number = 0): void {
  ecs.tasks.push({
    name,
    run,
    priority,
  });

  // Order tasks by priority
  ecs.tasks.sort((a, b) => {
    return b.priority - a.priority;
  });
}

export function runTasks<T extends ComponentsLists, U>(ecs: ECS<T, U>): void {
  for (let i = 0; i < ecs.tasks.length; i++) {
    console.log('Running task ', ecs.tasks[i].name);
    ecs.tasks[i].run(ecs);
  }
}

export function createECS<T extends ComponentsLists, U>(initialState: U, componentLists: T): ECS<T, U> {
  return {
    entityId: 0,
    entities: [],
    entitiesById: {},
    componentLists,
    tasks: [],
    state: initialState,
  };
}

function arraysMatch<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

export function entitiesMatch(a: Entity, b: Entity): boolean {
  return a.id === b.id
  && a.name === b.name
  && (arraysMatch(a.componentTypes, b.componentTypes));
}

export function hasNewEntites(entityList: Entity[], length: number, lastEntityId: number | null): boolean {
  return entityList.length !== length || (entityList.length > 0 && entityList[entityList.length - 1].id !== lastEntityId);
}

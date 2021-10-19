import { addComponent, addEntity, ComponentList, ComponentsLists, createComponentList, createECS, ECS, removeComponent } from '../simple-ecs-framework';

// type TestECS = ECS<TestECSComponents, TestECSState, TestECSFrameData>;

enum TestECSComponentTypes {
  transform = 'transform',
  bounceState = 'bounceState',
}

type TestECSState = {
  frameNumber: 0,
}

export type TestECSFrameData = {
  delta: number,
}

export type TransformComponent = {
  type: TestECSComponentTypes.transform,
  position: [number, number, number];
  rotation: number,
}
export type BounceStateComponent = {
  type: TestECSComponentTypes.bounceState,
  bouncing: boolean,
}

interface TestECSComponents extends ComponentsLists {
  [TestECSComponentTypes.transform]: ComponentList<TransformComponent>;
  [TestECSComponentTypes.bounceState]: ComponentList<BounceStateComponent>;
}


describe('Simple ECS Framework', () => {

  let ecs: ECS<TestECSComponents, TestECSState, TestECSFrameData>;

  beforeEach(() => {
    ecs = createECS<TestECSComponents, TestECSState, TestECSFrameData>({ frameNumber: 0 }, {
      [TestECSComponentTypes.transform]: createComponentList<TransformComponent>(),
      [TestECSComponentTypes.bounceState]: createComponentList<BounceStateComponent>(),
    });
  });

  describe('createECS', () => {
    it('should return a new empty ecs with the given component lists and state', () => {
      expect(ecs.componentLists[TestECSComponentTypes.transform].components).toHaveLength(0);
      expect(ecs.entities).toHaveLength(0);
      expect(ecs.state.frameNumber).toBe(0);
      expect(ecs.tasks).toHaveLength(0);
    });
  });

  describe('addComponent', () => {
    it('should add the component to the ECS', () => {
      const testComponentData: TransformComponent = { type: TestECSComponentTypes.transform, position: [5, 2, 1], rotation: 50 };
      addComponent(ecs, 1, testComponentData);
      expect(ecs.componentLists[TestECSComponentTypes.transform].components).toHaveLength(1);
      expect(ecs.componentLists[TestECSComponentTypes.transform].entityIndex[1]).toBeDefined();
      const index = ecs.componentLists[TestECSComponentTypes.transform].entityIndex[1];
      expect(ecs.componentLists[TestECSComponentTypes.transform].components[index].entityId).toBe(1);
      expect(ecs.componentLists[TestECSComponentTypes.transform].components[index].data.position).toStrictEqual([5, 2, 1]);
      expect(ecs.componentLists[TestECSComponentTypes.transform].components[index].data.rotation).toBe(50);
    });
  });

  describe('addEntity', () => {
    it('should return the added entities ID', () => {
      const entityId = addEntity(ecs, 'Test Entity', [
        { type: TestECSComponentTypes.transform, position: [5, 2, 1], rotation: 50 },
        { type: TestECSComponentTypes.bounceState, bouncing: true },
      ]);

      expect(ecs.entities[ecs.entitiesById[entityId]].id).toBe(entityId);
      expect(ecs.entities[ecs.entitiesById[entityId]].name).toBe('Test Entity');
      expect(ecs.entities[ecs.entitiesById[entityId]].componentTypes).toStrictEqual([TestECSComponentTypes.transform.toString(), TestECSComponentTypes.bounceState.toString()]);
    });

    it('should add the entity to the ECS', () => {
      addEntity(ecs, 'Test Entity', [
        { type: TestECSComponentTypes.transform, position: [5, 2, 1], rotation: 50 },
        { type: TestECSComponentTypes.bounceState, bouncing: true },
      ]);

      expect(ecs.entities).toHaveLength(1);
    });

    it('should add all the components to the ECS', () => {
      const entityId = addEntity(ecs, 'Test Entity', [
        { type: TestECSComponentTypes.transform, position: [8, 7, 6], rotation: 30 },
        { type: TestECSComponentTypes.bounceState, bouncing: true },
      ]);

      expect(ecs.componentLists[TestECSComponentTypes.transform].components).toHaveLength(1);
      expect(ecs.componentLists[TestECSComponentTypes.transform].entityIndex[entityId]).toBeDefined();
      const transformComponentIndex = ecs.componentLists[TestECSComponentTypes.transform].entityIndex[entityId];
      expect(ecs.componentLists[TestECSComponentTypes.transform].components[transformComponentIndex].entityId).toBe(entityId);
      expect(ecs.componentLists[TestECSComponentTypes.transform].components[transformComponentIndex].data.position).toStrictEqual([8, 7, 6]);
      expect(ecs.componentLists[TestECSComponentTypes.transform].components[transformComponentIndex].data.rotation).toBe(30);

      expect(ecs.componentLists[TestECSComponentTypes.bounceState].components).toHaveLength(1);
      expect(ecs.componentLists[TestECSComponentTypes.bounceState].entityIndex[entityId]).toBeDefined();
      const bounceComponentIndex = ecs.componentLists[TestECSComponentTypes.bounceState].entityIndex[entityId];
      expect(ecs.componentLists[TestECSComponentTypes.bounceState].components[bounceComponentIndex].entityId).toBe(entityId);
      expect(ecs.componentLists[TestECSComponentTypes.bounceState].components[bounceComponentIndex].data.bouncing).toBe(true);
    });
  });

  describe('removeComponentByEntityId', () => {
    it('shoud remove a componenet', () => {
      const testComponentData1: TransformComponent = { type: TestECSComponentTypes.transform, position: [5, 2, 1], rotation: 50 };
      const testComponentData2: TransformComponent = { type: TestECSComponentTypes.transform, position: [6, 7, 8], rotation: 10 };
      addComponent(ecs, 1, testComponentData1);
      addComponent(ecs, 2, testComponentData2);
      removeComponent(ecs, TestECSComponentTypes.transform, 2);
      expect(ecs.componentLists[TestECSComponentTypes.transform].entityIndex[2]).toBeUndefined();
      expect(ecs.componentLists[TestECSComponentTypes.transform].entityIndex[1]).toBeDefined();
      removeComponent(ecs, TestECSComponentTypes.transform, 1);
      expect(ecs.componentLists[TestECSComponentTypes.transform].entityIndex[1]).toBeUndefined();
    });
  });

  describe('removeEntity', () => {
    it('shoud remove an entity', () => {
      const testComponentData1: TransformComponent = { type: TestECSComponentTypes.transform, position: [5, 2, 1], rotation: 50 };
      const testComponentData2: TransformComponent = { type: TestECSComponentTypes.transform, position: [6, 7, 8], rotation: 10 };
      addComponent(ecs, 1, testComponentData1);
      addComponent(ecs, 2, testComponentData2);
      removeComponent(ecs, TestECSComponentTypes.transform, 2);
      expect(ecs.componentLists[TestECSComponentTypes.transform].entityIndex[2]).toBeUndefined();
      expect(ecs.componentLists[TestECSComponentTypes.transform].entityIndex[1]).toBeDefined();
      removeComponent(ecs, TestECSComponentTypes.transform, 1);
      expect(ecs.componentLists[TestECSComponentTypes.transform].entityIndex[1]).toBeUndefined();
    });

    it('shoud remove an entities components', () => {
      const testComponentData1: TransformComponent = { type: TestECSComponentTypes.transform, position: [5, 2, 1], rotation: 50 };
      const testComponentData2: TransformComponent = { type: TestECSComponentTypes.transform, position: [6, 7, 8], rotation: 10 };
      addComponent(ecs, 1, testComponentData1);
      addComponent(ecs, 2, testComponentData2);
      removeComponent(ecs, TestECSComponentTypes.transform, 2);
      expect(ecs.componentLists[TestECSComponentTypes.transform].entityIndex[2]).toBeUndefined();
      expect(ecs.componentLists[TestECSComponentTypes.transform].entityIndex[1]).toBeDefined();
      removeComponent(ecs, TestECSComponentTypes.transform, 1);
      expect(ecs.componentLists[TestECSComponentTypes.transform].entityIndex[1]).toBeUndefined();
    });
  });

  describe('createComponentList', () => {
    it('should return an empty component list', () => {
      const list = createComponentList();
      expect(list.components).toHaveLength(0);
    });
  });

  // describe('addTask', () => {

  // });

  // describe('runTasks', () => {

  // });

  // describe('entitiesMatch', () => {

  // });

  // describe('hasNewEntities', () => {

  // });

  // describe('getComponent', () => {

  // });
});


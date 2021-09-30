import { useEffect } from 'react';
import { useMutable } from './mutable-state';
import { useStore } from './store';

interface KeyConfig extends KeyMap {
  keys?: string[]
}

interface KeyMap {
  fn: (pressed: boolean) => void
  up?: boolean
  pressed?: boolean
}

function useKeys(keyConfig: KeyConfig[]): void {
  useEffect(() => {
    const keyMap = keyConfig.reduce<{ [key: string]: KeyMap }>((out, { keys, fn, up = true }) => {
      const newOut = { ...out };
      if (keys) keys.forEach((key) => { newOut[key] = { fn, pressed: false, up }; });
      return newOut;
    }, {});

    const downHandler = ({ key, target }: KeyboardEvent) => {
      if (!keyMap[key] || (target as HTMLElement).nodeName === 'INPUT') return;
      const { fn, pressed, up } = keyMap[key];
      keyMap[key].pressed = true;
      if (up || !pressed) fn(true);
    };

    const upHandler = ({ key, target }: KeyboardEvent) => {
      if (!keyMap[key] || (target as HTMLElement).nodeName === 'INPUT') return;
      const { fn, up } = keyMap[key];
      keyMap[key].pressed = false;
      if (up) fn(false);
    };

    window.addEventListener('keydown', downHandler, { passive: true });
    window.addEventListener('keyup', upHandler, { passive: true });

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [keyConfig]);
}

export function Keyboard(): null {
  const { mutable } = useMutable();
  useKeys([
    { keys: ['ArrowUp', 'w', 'W', 'z', 'Z'], fn: (forward) => { if (mutable.ecs) mutable.ecs.state.inputs.forward = forward; } },
    { keys: ['ArrowDown', 's', 'S'], fn: (backward) => { if (mutable.ecs) mutable.ecs.state.inputs.backward = backward; } },
    { keys: ['ArrowLeft', 'a', 'A', 'q', 'Q'], fn: (left) => { if (mutable.ecs) mutable.ecs.state.inputs.left = left; } },
    { keys: ['ArrowRight', 'd', 'D'], fn: (right) => { if (mutable.ecs) mutable.ecs.state.inputs.right = right; } },
    // { keys: [' '], fn: (shoot) => { if (mutable.ecs) mutable.ecs.state.inputs.shoot = shoot; } },
  ]);
  return null;
}

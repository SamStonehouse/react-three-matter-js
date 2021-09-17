import React, { useContext } from 'react';

interface IMutableContext<T> {
  mutable: T;
}

function createMutableContext<T>(initialState: T): React.Context<IMutableContext<T>> {
  return React.createContext<IMutableContext<T>>({ mutable: initialState });
}

interface IMutableProviderProps {
  children: React.ReactNode,
}

export function createMutableProvider<T>(MutableContext: React.Context<IMutableContext<T>>, initialState: T) {
  return function MutableProvider({ children }: IMutableProviderProps): React.ReactElement {
    return (
      <MutableContext.Provider
        value={{ mutable: initialState }}
      >
        {children}
      </MutableContext.Provider>
    );
  };
}

function createUseMutable<T>(MutableContext) {
  return function useMutable(): IMutableContext<T> {
    return useContext(MutableContext);
  };
}

interface IMutables<T> {
  MutableContext: React.Context<IMutableContext<T>>
  MutableProvider(props: IMutableProviderProps): React.ReactElement
  useMutable(): IMutableContext<T>,
}

export function createMutable<T>(initialState: T): IMutables<T> {
  const MutableContext = createMutableContext<T>(initialState); // We type the Context based on the generic AuthService
  const MutableProvider = createMutableProvider<T>(MutableContext, initialState);
  const useMutable = createUseMutable<T>(MutableContext);

  return {
    MutableContext,
    MutableProvider,
    useMutable,
  };
}

import _get from 'lodash/get';
import _omit from 'lodash/omit';
import _set from 'lodash/set';
import React from 'react';
import usePersistedState from '~/utils/use-persisted-state';
import useWindowFocusFn from '~/utils/use-window-focus-fn';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppState extends Record<string, any> {
  //
}

type AppStateContextValue = {
  value: AppState;
  set: (key: string, value: any) => void;
  setMulti: (values: Record<string, any>) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const Context = React.createContext<AppStateContextValue | undefined>(
  undefined
);

function AppStateProvider({ children }: { children: any }) {
  const __storage__ = usePersistedState<AppState>('app-state');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useWindowFocusFn((e: any) => {
    // console.log(e);
  });

  function set(key: string, value: any) {
    __storage__.set((state) => _set({ ...state }, key, value));
  }

  function setMulti(values: Record<string, unknown>) {
    __storage__.set((state) => {
      let updatedState = { ...state };

      Object.keys(values).forEach((key) => {
        const value = values[key];
        const value__ =
          typeof value === 'function' ? value(_get(updatedState, key)) : value;

        updatedState = _set(updatedState, key, value__);
      });

      return updatedState;
    });
  }

  function remove(key: string | string[]) {
    __storage__.set((state) => _omit(state, key));
  }

  function clear() {
    __storage__.remove();
  }

  const value: AppStateContextValue = {
    value: __storage__.value || {},
    set,
    setMulti,
    remove,
    clear,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAppState() {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error('useAppState must be used within a AppStateProvider');
  }

  return context;
}

export default AppStateProvider;

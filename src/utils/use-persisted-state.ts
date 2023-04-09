import React from 'react';

type UsePersistentState<T> = {
  value: T | undefined;
  set: React.Dispatch<React.SetStateAction<T | undefined>>;
  remove: () => void;
};

function usePersistentState<T>(
  key: string,
  initialValue?: T | (() => T)
): UsePersistentState<T> {
  function getInitialValue() {
    try {
      const persistedValue = window.localStorage.getItem(key);
      return persistedValue ? JSON.parse(persistedValue) : initialValue;
    } catch (e) {
      return initialValue;
    }
  }

  const [value, setValue] = React.useState<T | undefined>(getInitialValue);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value || undefined));
    } catch (e) {
      console.error(e);
    }
  }, [value, key]);

  function removeValue() {
    window.localStorage.removeItem(key);
    setValue(initialValue);
  }

  return { value, set: setValue, remove: removeValue };
}

export default usePersistentState;

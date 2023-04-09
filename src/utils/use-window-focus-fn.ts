import React from 'react';

function useWindowFocusFn(callback: (focused: boolean) => void) {
  React.useEffect(() => {
    function listener(e: any) {
      callback(e);
    }

    if (typeof window !== undefined) {
      // Listen to visibillitychange and focus
      window.addEventListener('visibilitychange', listener, false);
      window.addEventListener('focus', listener, false);

      return () => {
        // Be sure to unsubscribe if a new handler is set
        window.removeEventListener('visibilitychange', listener);
        window.removeEventListener('focus', listener);
      };
    }
  }, [callback]);
}

export default useWindowFocusFn;

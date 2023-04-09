import { useRouter } from 'next/router';
import React from 'react';
import { ApiError } from '~/api';

type ErrorPresenterContextValue = {
  error: ApiError | null;
  setError: (error: ApiError) => void;
  clearError: () => void;
};

const ErrorPresenterontext = React.createContext<
  ErrorPresenterContextValue | undefined
>(undefined);

type P = React.PropsWithChildren<unknown>;

export function ErrorPresenterProvider({ children }: P) {
  const [error, setError] = React.useState<ApiError | null>(null);
  const router = useRouter();

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const setError__ = React.useCallback((e: typeof error) => {
    if (e && e.message) {
      setError(e);
    }
  }, []);

  React.useEffect(() => {
    function handleRouteChange() {
      clearError();
    }

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [clearError, router]);

  const value: ErrorPresenterContextValue = React.useMemo(
    () => ({
      error,
      setError: setError__,
      clearError,
    }),
    [clearError, error, setError__]
  );

  return (
    <ErrorPresenterontext.Provider value={value}>
      {children}
    </ErrorPresenterontext.Provider>
  );
}

export function useErrorPresenter() {
  const context = React.useContext(ErrorPresenterontext);
  if (!context) {
    throw new Error(
      'useErrorPresenter must be used within a ErrorPresenterContext'
    );
  }
  return context;
}

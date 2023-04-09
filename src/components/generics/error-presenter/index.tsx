import { Button } from '@mui/material';
import { popupish } from '@xod/mui-popupish';
import React from 'react';
import { ApiError } from '~/api';
import { ErrorPresenterProvider, useErrorPresenter } from './provider';

type ErrorPresenterProps = React.PropsWithChildren<unknown>;

function ErrorPresenter({ children }: ErrorPresenterProps) {
  return (
    <ErrorPresenterProvider>
      <InterceptedErrorPresenter>{children}</InterceptedErrorPresenter>
    </ErrorPresenterProvider>
  );
}

export { useErrorPresenter } from './provider';

type InterceptedErrorPresenterProps = React.PropsWithChildren<unknown>;

function InterceptedErrorPresenter({
  children,
}: InterceptedErrorPresenterProps) {
  return (
    <React.Fragment>
      {children}
      <NotifiableErrorPresenter />
    </React.Fragment>
  );
}

function NotifiableErrorPresenter() {
  const { error, clearError } = useErrorPresenter();

  React.useEffect(() => {
    if (error && isNotifiableError(error)) {
      const statusCode = error.response?.status || 0;
      const message =
        statusCode >= 500 && statusCode <= 510
          ? 'Something went wrong'
          : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            error.data.message || error.message;

      const handleAction = () => {
        void error.retry?.();
        n.close();
      };

      const n = popupish.notify({
        message,
        autoHideDuration: error.retryable ? null : 3000,
        action: error.retryable && (
          <Button color="primary" onClick={handleAction}>
            Retry
          </Button>
        ),
        onClose: () => {
          clearError();
        },
      });
    }
  }, [error, clearError]);

  return null;
}

const exclusions = ['undefined', 'Request failed with'];

function isNotifiableError(error: ApiError) {
  if (!error?.message) {
    return false;
  }

  return !exclusions.some((entry) => error.message.includes(entry));
}

export default ErrorPresenter;

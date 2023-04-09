import {
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { TaskDef, TaskDefObj, usePerformTask, useTask } from '@xod/tasks';
import { ApiError } from '~/api';
import { useErrorPresenter } from '~/components/generics/error-presenter';

export function useErrorAwareQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'initialData'
  > & {
    initialData?: TQueryFnData | (() => TQueryFnData);
  }
) {
  const { setError } = useErrorPresenter();

  const query = useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    onError: (error, ...args) => {
      const error__ = error as ApiError;

      if (canHandleError(error__)) {
        error__.retryable = true;
        error__.retry = query.refetch;
        setError(error__);
      }

      options?.onError?.(error, ...args);
    },
  });

  return query;
}

type UseInfiniteQuery = typeof useInfiniteQuery;

export const useErrorAwareInfiniteQuery: UseInfiniteQuery = (
  options: UseInfiniteQueryOptions
) => {
  const { setError } = useErrorPresenter();

  const query = useInfiniteQuery({
    ...options,
    onError: (error, ...args) => {
      const error__ = error as ApiError;

      if (canHandleError(error__)) {
        error__.retryable = true;
        error__.retry = query.refetch;
        setError(error__);
      }

      options?.onError?.(error, ...args);
    },
  });

  return query;
};

export function useErrorAwareTask<
  TInput = unknown,
  TResult = unknown,
  TRollback = unknown
>(def: TaskDefObj<TInput, TResult, TRollback>) {
  const { setError } = useErrorPresenter();

  return useTask<TInput, TResult, TRollback>({
    ...def,
    handlers: {
      ...def.handlers,
      onError: (error, ...args) => {
        const error__ = error as ApiError;

        if (canHandleError(error__)) {
          setError(error__);
        }

        def.handlers?.onError?.(error, ...args);
      },
    },
  });
}

export function useErrorAwarePerformTask<
  TInput = unknown,
  TResult = unknown,
  TRollback = unknown
>(def: TaskDef<TInput, TResult, TRollback>) {
  const { setError } = useErrorPresenter();

  return usePerformTask<TInput, TResult, TRollback>((args) => {
    const def_ = typeof def === 'function' ? def(args) : def;

    return {
      ...def_,
      handlers: {
        ...def_.handlers,
        onError: (error, ...args) => {
          const error__ = error as ApiError;

          if (canHandleError(error__)) {
            setError(error__);
          }

          return def_.handlers?.onError?.(error, ...args);
        },
      },
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function canHandleError(_error: ApiError) {
  return true; //Number(error.statusCode) === StatusCode.INTERNAL_SERVER_ERROR;
}

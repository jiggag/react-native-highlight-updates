import type {SetStateAction} from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {QueryObserver, useQueryClient} from 'react-query';

export interface A {
  [key: string]: string;
}
type B = string;

type QuerySelectorKey = 'A' | 'B';

type QuerySelector = A | B;

const initialState: Record<QuerySelectorKey, A | B> = {
  A: {},
  B: '',
};

// TODO state 타입 추론
export const useQuerySelector = (querySelectorKey: QuerySelectorKey) => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<QuerySelector>(
    initialState[querySelectorKey],
  );

  const handleState = useCallback(
    (newState: SetStateAction<QuerySelector>) => {
      setState(newState);
      queryClient.setQueryData<QuerySelector>(querySelectorKey, prevState => {
        if (typeof newState !== 'function') {
          return newState;
        }

        return newState(prevState || initialState[querySelectorKey]);
      });
    },
    [querySelectorKey, queryClient],
  );

  const handleObserver = useCallback(() => {
    const observer = new QueryObserver<QuerySelector>(queryClient, {
      notifyOnChangeProps: ['data', 'isSuccess'],
      queryFn: () => initialState[querySelectorKey],
      queryKey: querySelectorKey,
      staleTime: Infinity,
    });

    return observer.subscribe(result => {
      if (result.isSuccess) {
        handleState(result.data);
      }
    });
  }, [handleState, querySelectorKey, queryClient]);

  useEffect(() => {
    const unsubscribe = handleObserver();

    return () => {
      unsubscribe();
    };
  }, [handleObserver]);

  return useMemo(() => ({handleState, state}), [handleState, state]);
};

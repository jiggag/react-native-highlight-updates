import {useCallback, useEffect, useMemo, useRef} from 'react';

export const useCurring = (fn, deps) => {
  const ref = useRef();

  const callback = useCallback(() => fn(...ref.current), deps);

  return useCallback(
    (...arg) => {
      ref.current = arg || [];

      return callback();
    },
    [callback],
  );
};

export const useMemoCurring = (fn, deps) => {
  const argRef = useRef();
  const fnRef = useRef(fn);
  const depsRef = useRef(deps);
  const callbackRef = useRef(() => {
    fnRef.current(argRef.current)();
  });

  const memoizedDeps = useMemo(() => deps, deps);

  useEffect(() => {
    if (depsRef.current !== memoizedDeps) {
      callbackRef.current = () => {
        fnRef.current(argRef.current)();
      };
      depsRef.current = memoizedDeps;
    }
  }, [memoizedDeps]);

  return useCallback((...arg) => {
    argRef.current = arg || [];

    return callbackRef.current;
  }, []);
};

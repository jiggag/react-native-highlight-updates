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

export const useParamsCurring = (fn, deps) => {
  const indexRef = useRef(0);
  const fnRef = useRef(fn);
  const depsRef = useRef(deps);
  const paramsMapRef = useRef({});
  const callbackMapRef = useRef({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedDeps = useMemo(() => deps, deps);

  useEffect(() => {
    if (depsRef.current !== memoizedDeps) {
      fnRef.current = fn;
      depsRef.current = memoizedDeps;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedDeps]);

  return useCallback((...arg) => {
    const key = indexRef.current;
    paramsMapRef.current = {
      ...paramsMapRef.current,
      [key]: arg || [],
    };
    callbackMapRef.current = {
      ...callbackMapRef.current,
      [key]: () => {
        fnRef.current(paramsMapRef.current[key])();
      },
    };
    indexRef.current = indexRef.current + 1;
    return callbackMapRef.current[key];
  }, []);
};


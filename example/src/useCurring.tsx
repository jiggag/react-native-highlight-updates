import {useCallback, useEffect, useMemo, useRef} from 'react';

type Callback = () => void;
type CurringFn = (...params: unknown[]) => Callback;
type UseCurring = (fn: CurringFn, deps: unknown[]) => CurringFn;

type CurringParamsWithKey = {curringKey: string; params: unknown[]};
type CurringFnWithoutKey = (params: CurringParamsWithKey['params']) => Callback;
type CurringFnWithKey = (params: CurringParamsWithKey) => Callback;
type UseCurringWithKey = (
  fn: CurringFnWithoutKey,
  deps: unknown[],
) => CurringFnWithKey;

export const useCurring: UseCurring = (fn, deps) => {
  const ref = useRef<unknown[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(() => fn(...ref.current), deps);

  return useCallback(
    (...arg) => {
      ref.current = arg || [];

      return callback();
    },
    [callback],
  );
};

export const useMemoCurring: UseCurring = (fn, deps) => {
  const argRef = useRef<unknown[]>([]);
  const fnRef = useRef(fn);
  const depsRef = useRef(deps);
  const callbackRef = useRef(() => {
    fnRef.current(argRef.current)();
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

export const useParamsCurring: UseCurring = (fn, deps) => {
  const indexRef = useRef(0);
  const fnRef = useRef(fn);
  const depsRef = useRef(deps);
  const paramsMapRef = useRef<Record<string, unknown[]>>({});
  const callbackMapRef = useRef<Record<string, CurringFn>>({});
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

export const useParamsMemoCurring: UseCurring = (fn, deps) => {
  const fnRef = useRef(fn);
  const depsRef = useRef(deps);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedDeps = useMemo(() => deps, deps);

  useEffect(() => {
    if (depsRef.current !== memoizedDeps) {
      fnRef.current = fn;
      depsRef.current = memoizedDeps;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedDeps]);

  const cb = useRef((params: unknown[]) => {
    const fn1 = fnRef.current(params);
    return ((param, fn) => {
      return fn;
    })(params, fn1);
  });
  return useCallback((...arg) => {
    return cb.current(arg || []);
  }, []);
};

export const useParamsMemoCurringSerialize: UseCurring = (fn, deps) => {
  const fnRef = useRef(fn);
  const depsRef = useRef(deps);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedDeps = useMemo(() => deps, deps);

  useEffect(() => {
    if (depsRef.current !== memoizedDeps) {
      fnRef.current = fn;
      depsRef.current = memoizedDeps;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedDeps]);

  const cbMapRef = useRef<Record<string, Callback>>({});
  const cbRef = useRef((params: unknown[]) => {
    const curringFn = fnRef.current(params);
    const serializeParams = JSON.stringify(params);
    return ((index, fn) => {
      if (!cbMapRef.current[index]) {
        cbMapRef.current = {
          ...cbMapRef.current,
          [index]: fn,
        };
      }

      return index;
    })(serializeParams, curringFn);
  });
  return useCallback((...arg) => {
    const index = cbRef.current(arg || []);
    return cbMapRef.current[index];
  }, []);
};

const deepSerialize = (args: unknown[]) => {
  // TODO useCurring 파라미터 직렬화
  return args;
};

export const useParamsMemoCurringKey: UseCurringWithKey = (fn, deps) => {
  const fnRef = useRef(fn);
  const depsRef = useRef(deps);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedDeps = useMemo(() => deps, deps);

  useEffect(() => {
    if (depsRef.current !== memoizedDeps) {
      fnRef.current = fn;
      depsRef.current = memoizedDeps;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedDeps]);

  const cbMapRef = useRef<Record<string, Callback>>({});
  const cbRef = useRef(
    (curringKey: string, params: CurringParamsWithKey['params']) => {
      const curringFn = fnRef.current(params);
      return ((index, fn) => {
        if (!cbMapRef.current[index]) {
          cbMapRef.current = {
            ...cbMapRef.current,
            [index]: fn,
          };
        }

        return index;
      })(curringKey, curringFn);
    },
  );
  return useCallback((argsObj: CurringParamsWithKey) => {
    if (argsObj?.curringKey === undefined) {
      throw Error(
        `[useParamsMemoCurringKey] 파라미터에 curringKey를 포함해야합니다 (params: ${argsObj})`,
      );
    }
    const {curringKey, params} = argsObj;
    const index = cbRef.current(curringKey, params || []);
    return cbMapRef.current[index];
  }, []);
};

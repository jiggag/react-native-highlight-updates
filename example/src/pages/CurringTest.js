import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  useCurring,
  useMemoCurring,
  useParamsCurring,
  useParamsMemoCurring,
  useParamsMemoCurringSerialize,
} from '../useCurring';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {WithHighlight} from '../WithHighlight';

// onPress: () => void;
const Memoized4 = memo(({index, onPress}) => {
  return (
    <View style={styles.container}>
      <WithHighlight color="yellow">
        <Pressable onPress={onPress}>
          <Text>useCurring: curring(n) {index}</Text>
        </Pressable>
      </WithHighlight>
    </View>
  );
});

// curring: () => () => void
const MemoizedParent = memo(({index, curring}) => {
  console.log(
    `[MemoizedParent-${index}] 상위 컴포넌트가 리렌더 되면 curring 형태에 따라 리렌더 된다`,
  );
  return (
    <View style={styles.container}>
      <WithHighlight color="yellow">
        <Pressable onPress={curring(index)}>
          <Text>useCurring: curring {index}</Text>
        </Pressable>
      </WithHighlight>
    </View>
  );
});

// curring: () => () => void
const MemoizedChild = memo(({curring, index}) => {
  console.log('[MemoizedChild] curring 형태에 따라 리렌더 된다');
  return (
    <View style={styles.container}>
      <WithHighlight color="yellow">
        <MemoizedParent curring={curring} index={index} />
      </WithHighlight>
    </View>
  );
});

export const CurringTest = memo(() => {
  const [, setCount] = useState(0);
  const [deps, setDeps] = useState(0);

  const curring = useCurring(
    params => () => {
      console.log('[useCurring] call', params);
    },
    [],
  );

  const memoCurring = useMemoCurring(
    params => () => {
      console.log('[useMemoCurring] call', params);
    },
    [deps],
  );

  const paramsCurring = useParamsCurring(
    params => () => {
      console.log('[paramsCurring] call', params);
    },
    [deps],
  );

  const paramsMemoCurring = useParamsMemoCurring(
    params => () => {
      console.log('[paramsMemoCurring] call', params);
    },
    [deps],
  );

  const paramsMemoCurringSerialize = useParamsMemoCurringSerialize(
    params => () => {
      console.log('[paramsMemoCurringSerialize] call', params);
    },
    [deps],
  );

  const renderMemo = useMemo(
    () => (
      <Pressable onPress={curring(2)}>
        <Text>useCurring: useMemo 2</Text>
      </Pressable>
    ),
    [curring],
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(prev => {
        console.log('>>>>>>>>>>>> count 업데이트', prev);
        // setDeps(Math.floor(prev / 5));
        return prev + 1;
      });
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        {/*<WithHighlight>*/}
        {/*  <Pressable onPress={curring(1)}>*/}
        {/*    <Text>useCurring 1</Text>*/}
        {/*  </Pressable>*/}
        {/*</WithHighlight>*/}
        {/*<Text>{`*/}
        {/*컴포넌트: 리렌더*/}
        {/*curring(1): 메모이제이션*/}
        {/*`}</Text>*/}

        {/*<WithHighlight>{renderMemo}</WithHighlight>*/}
        {/*<Text>{`*/}
        {/*컴포넌트: 메모이제이션*/}
        {/*`}</Text>*/}

        {/*<WithHighlight>*/}
        {/*  <MemoizedParent curring={curring} index={2} />*/}
        {/*</WithHighlight>*/}
        {/*<Text>{`*/}
        {/*컴포넌트: 리렌더*/}
        {/*curring: 메모이제이션*/}
        {/*`}</Text>*/}

        {/*<WithHighlight>*/}
        {/*  <MemoizedChild curring={curring} index={3} />*/}
        {/*</WithHighlight>*/}
        {/*<Text>{`*/}
        {/*컴포넌트: 리렌더*/}
        {/*curring: 메모이제이션*/}
        {/*`}</Text>*/}

        {/*<WithHighlight>*/}
        {/*  <Memoized4 onPress={curring(4)} index={4} />*/}
        {/*</WithHighlight>*/}
        {/*<Text>{`*/}
        {/*컴포넌트: 리렌더*/}
        {/*curring(4): 리렌더 유발*/}
        {/*=> useCurring을 props로 넘기는데 이슈가 되는 상황*/}
        {/*=> 아무것도 메모이제이션 되지 않음*/}
        {/*`}</Text>*/}

        {/*<WithHighlight>*/}
        {/*  <Memoized4 onPress={memoCurring(5)} index={5} />*/}
        {/*</WithHighlight>*/}
        {/*<Text>{`*/}
        {/*컴포넌트: 리렌더*/}
        {/*memoCurring(5): 메모이제이션*/}
        {/*=> curring deps 업데이트 시점에 훅 업데이트 발생*/}
        {/*=> 그 외에는 메모이제이션*/}
        {/*`}</Text>*/}
        {/*<WithHighlight>*/}
        {/*  <Memoized4 onPress={memoCurring(6)} index={6} />*/}
        {/*</WithHighlight>*/}
        {/*<Text>{`*/}
        {/*컴포넌트: 리렌더*/}
        {/*memoCurring(6): 메모이제이션*/}
        {/*=> curring params가 마지막으로 사용한 func 기준으로 덮어씌워지는 이슈*/}
        {/*=> memoCurring(5) 와 memoCurring(6) 사용했으나 마지막 사용한 memoCurring(6)으로 로그 찍힘*/}
        {/*`}</Text>*/}

        {/*<WithHighlight>*/}
        {/*  <Memoized4 onPress={paramsCurring(7)} index={7} />*/}
        {/*</WithHighlight>*/}
        {/*<WithHighlight>*/}
        {/*  <Memoized4 onPress={paramsCurring(7.5)} index={7.5} />*/}
        {/*</WithHighlight>*/}
        {/*<Text>{`*/}
        {/*컴포넌트: 리렌더*/}
        {/*paramsCurring(7): 리렌더 유발*/}
        {/*=> paramsCurring(7)가 새로운 콜백을 만들어내면서 파라미터 덮어씌워지는 이슈는 없어졌으나 메모이제이션 안됨 */}
        {/*`}</Text>*/}

        <WithHighlight>
          <Memoized4 onPress={paramsMemoCurring(8)} index={8} />
        </WithHighlight>
        <WithHighlight>
          <Memoized4 onPress={paramsMemoCurring(8.5)} index={8.5} />
        </WithHighlight>
        <Text>{`
        컴포넌트: 리렌더
        paramsMemoCurring(n): 리렌더
        => 파라미터가 각각 8, 8.5 정상 동작하지만 curring 리렌더 계속 유발
        `}</Text>
        <WithHighlight>
          <MemoizedParent curring={paramsMemoCurring} index="parent_9" />
        </WithHighlight>
        <WithHighlight>
          <MemoizedParent curring={paramsMemoCurring} index="parent_9.5" />
        </WithHighlight>
        <Text>{`
        컴포넌트: 리렌더
        paramsMemoCurring: 메모이제이션
        => paramsMemoCurring 전체가 메모이제이션 되어서 전달
        => 파라미터가 각각 9, 9.5 정상 동작
        `}</Text>

        <WithHighlight>
          <Memoized4
            onPress={paramsMemoCurringSerialize([1, 2, 3])}
            index={'[1,2,3]'}
          />
        </WithHighlight>
        <WithHighlight>
          <Memoized4
            onPress={paramsMemoCurringSerialize([3, 2, 1])}
            index={'[3,2,1]'}
          />
        </WithHighlight>
        <WithHighlight>
          <Memoized4
            onPress={paramsMemoCurringSerialize(4, 5, 6)}
            index={'4,5,6'}
          />
        </WithHighlight>
        <WithHighlight>
          <Memoized4
            onPress={paramsMemoCurringSerialize('첫번째', {
              key: 'value',
              name: '파라미터',
            })}
            index={"'첫번째', { key: 'value', name: '파라미터' }"}
          />
        </WithHighlight>
        <WithHighlight>
          <Memoized4
            onPress={paramsMemoCurringSerialize(4, [
              '두번째',
              '파라미터',
              {key: '이런거'},
            ])}
            index={"4,['두번째', '파라미터', {key:'이런거'}]"}
          />
        </WithHighlight>
        <Text>{`
        컴포넌트: 리렌더
        paramsMemoCurringSerialize(n): 메모이제이션
        => 파라미터가 변경되면 커링 1차 함수도 새로 만들어져야하므로 리렌더가 의도됨
        => 전달하는 파라미터를 직렬화하여 키로 사용
        => 파라미터가 각각 정상 동작
        `}</Text>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
});

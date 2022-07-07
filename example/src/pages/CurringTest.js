import React, {memo, useEffect, useMemo, useState} from 'react';
import {useCurring, useMemoCurring} from '../useCurring';
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
        setDeps(Math.floor(prev / 5));
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <WithHighlight>
          <Pressable onPress={curring(1)}>
            <Text>useCurring 1</Text>
          </Pressable>
        </WithHighlight>
        <Text>{`
        컴포넌트: 리렌더
        curring(1): 메모이제이션
        `}</Text>

        <WithHighlight>{renderMemo}</WithHighlight>
        <Text>{`
        컴포넌트: 메모이제이션
        `}</Text>

        <WithHighlight>
          <MemoizedParent curring={curring} index={2} />
        </WithHighlight>
        <Text>{`
        컴포넌트: 리렌더
        curring: 메모이제이션
        `}</Text>

        <WithHighlight>
          <MemoizedChild curring={curring} index={3} />
        </WithHighlight>
        <Text>{`
        컴포넌트: 리렌더
        curring: 메모이제이션
        `}</Text>

        <WithHighlight>
          <Memoized4 onPress={curring(4)} index={4} />
        </WithHighlight>
        <Text>{`
        컴포넌트: 리렌더
        curring(4): 리렌더 유발
        => useCurring을 props로 넘기는데 이슈가 되는 상황
        => 아무것도 메모이제이션 되지 않음
        `}</Text>

        <WithHighlight>
          <Memoized4 onPress={memoCurring(5)} index={5} />
        </WithHighlight>
        <Text>{`
        컴포넌트: 리렌더
        memoCurring(5): 메모이제이션
        => curring deps 업데이트 시점에 훅 업데이트 발생
        => 그 외에는 메모이제이션
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

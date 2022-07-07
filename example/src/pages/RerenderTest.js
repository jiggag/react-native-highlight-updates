import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {WithHighlight} from '../WithHighlight';

const MemoizedParent = memo(({children, index = 0}) => {
  console.log(
    `[MemoizedParent-${index}] 상위 컴포넌트가 리렌더 되면 children 형태에 따라 리렌더 된다`,
  );
  return (
    <View style={styles.container}>
      <WithHighlight color="gray">{children}</WithHighlight>
    </View>
  );
});

const MemoizedChild = memo(({index = 0}) => {
  console.log(`[MemoizedChild-${index}] 마운트만 되고 리렌더 되지 않는다`);
  return (
    <WithHighlight color="pink">
      <Text>MemoizedChild</Text>
    </WithHighlight>
  );
});

export const RerenderTest = memo(() => {
  const [, setCount] = useState(0);

  const renderMemo = useMemo(() => {
    console.log('[useMemo] 메모이제이션 되어있다');
    return (
      <WithHighlight color="green">
        <Text>renderMemo</Text>
      </WithHighlight>
    );
  }, []);

  const renderParentMemo = useMemo(() => {
    console.log('[renderParentMemo] 메모이제이션 되어있다');
    return <WithHighlight color="orange">{renderMemo}</WithHighlight>;
  }, [renderMemo]);

  const renderCallback = useCallback(index => {
    console.log(
      `[useCallback-${index}] 콜백 자체는 메모이제이션 되었지만 매번 새로운 jsx 반환한다`,
    );
    return (
      <WithHighlight color="green">
        <Text>useCallback</Text>
      </WithHighlight>
    );
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(prev => {
        console.log('>>>>>>>>>>>> count 업데이트', prev);
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  /*
   => 최종적으로 children 리렌더가 되는 조합은 6,7번 useCallback을 쓰는 것
      => memo로만 감싸서 children으로 전달하는 것은 무의미하다
      => props로 한번 더 뎁스 전달할거면 useMemo가 나은 선택

   => useMemo = memoized value
   => useCallback = memoized version of the callback
   */

  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={styles.title}>children 형태에 따른 리렌더 확인</Text>

        {/* 1. Pure */}
        <WithHighlight>
          <Text>Text</Text>
        </WithHighlight>
        <Text>
          {`
          1. Pure
            - props.children 변경됨
            - component 리렌더
            - children 메모이제이션
        `}
        </Text>

        {/* 2. renderMemo */}
        <WithHighlight>{renderMemo}</WithHighlight>
        <Text>
          {`
          2. renderMemo
            - props.children 메모이제이션
            - component 메모이제이션
            - children 메모이제이션
        `}
        </Text>

        {/* 3. memo */}
        <WithHighlight>
          <MemoizedChild index={3} />
        </WithHighlight>
        <Text>
          {`
          3. memo
            - props.children 변경됨
            - component 메모이제이션
            - children 메모이제이션
        `}
        </Text>

        {/* 4. memo + memo */}
        <WithHighlight color="blue">
          <MemoizedParent index={4}>
            <MemoizedChild index={4} />
          </MemoizedParent>
        </WithHighlight>
        <Text>
          {`
          4. memo + memo
            - props.children 변경됨
            - parent component 리렌더 => parent.children이 memo이기 때문에
            - child component 메모이제이션
            - children 메모이제이션
        `}
        </Text>

        {/* 5. memo + renderMemo */}
        <WithHighlight>
          <MemoizedParent index={5}>{renderMemo}</MemoizedParent>
        </WithHighlight>
        <Text>
          {`
          5. memo + renderMemo
            - props.children 변경됨
            - parent component 메모이제이션 => parent.children이 메모이제이션된 renderMemo 이므로
            - child component 메모이제이션
            - children 메모이제이션
        `}
        </Text>

        {/* 6. renderCallback */}
        <WithHighlight>{renderCallback(6)}</WithHighlight>
        <Text>
          {`
          6. renderCallback
            - props.children 변경됨
            - component 리렌더
            - children 리렌더
        `}
        </Text>

        {/* 7. memo + renderCallback */}
        <WithHighlight>
          <MemoizedParent index={7}>{renderCallback(7)}</MemoizedParent>
        </WithHighlight>
        <Text>
          {`
          7. memo + renderCallback
            - props.children 변경됨
            - parent component 리렌더
            - child component 리렌더
            - children 리렌더
        `}
        </Text>

        {/* 8. renderMemo + renderMemo */}
        <WithHighlight>{renderParentMemo}</WithHighlight>
        <Text>
          {`
          8. renderMemo + renderMemo
            - props.children 메모이제이션
            - parent component 메모이제이션
            - child component 메모이제이션
            - children 메모이제이션
        `}
        </Text>
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

import React, {memo, useEffect} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';
import {WithHighlight} from 'WithHighlight';
import {A, useQuerySelector} from '../useQuerySelector';

const CComponent = memo(() => {
  const {} = useQuerySelector('B');

  return (
    <WithHighlight color="blue">
      <Text>C: B와 같은 전역상태를 바라보고 있을뿐</Text>
    </WithHighlight>
  );
});

const BComponent = memo(() => {
  const {handleState} = useQuerySelector('B');

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleState(prev => {
        console.log('>>>>>>>>>>>> B 업데이트', prev);
        return prev + '1';
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [handleState]);

  return (
    <WithHighlight color="green">
      <Text>B</Text>
    </WithHighlight>
  );
});

export const QuerySelectorTest = memo(() => {
  const {handleState} = useQuerySelector('A');

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleState(prev => {
        console.log('>>>>>>>>>>>> A 업데이트', prev);
        return {...(prev as A), [`${new Date().getMilliseconds()}`]: ''};
      });
    }, 2500);

    return () => {
      clearInterval(intervalId);
    };
  }, [handleState]);

  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={styles.title}>useQuerySelector 컴포넌트 리렌더 확인</Text>

        <WithHighlight>
          <>
            <Text>A</Text>
            <CComponent />
          </>
        </WithHighlight>
        <BComponent />
        <CComponent />
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

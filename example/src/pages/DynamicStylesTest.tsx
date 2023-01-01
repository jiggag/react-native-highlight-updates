import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {WithHighlight} from 'WithHighlight';

export const DynamicStylesTest = memo(() => {
  const [_, setCount] = useState(0);

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

  const dynamicStyles = useMemo(() => {
    return {
      title: {
        color: 'red',
      },
    };
  }, []);

  const memoizedStyle = useMemo(() => {
    return {
      color: 'red',
    };
  }, []);

  const renderMemo = useMemo(() => {
    return <Text style={styles.title}>NativeStyle</Text>;
  }, []);

  const renderMemo2 = useMemo(() => {
    return <Text style={dynamicStyles.title}>DynamicStyle</Text>;
  }, [dynamicStyles.title]);

  const renderMemo3 = useMemo(() => {
    return <Text style={memoizedStyle}>MemoizedStyle</Text>;
  }, [memoizedStyle]);


  return (
    <SafeAreaView>
      <WithHighlight color="red">{renderMemo}</WithHighlight>
      <WithHighlight color="red">
        <Text style={dynamicStyles.title}>DynamicStyle</Text>
      </WithHighlight>
      <WithHighlight color="blue">{renderMemo2}</WithHighlight>
      <WithHighlight color="blue">{renderMemo3}</WithHighlight>
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

import React, {memo, ReactNode, useMemo, useRef} from 'react';
import {Animated, View} from 'react-native';

interface WithHighlightProps {
  color?: string;
  children: ReactNode;
}

export const WithHighlight = memo(({color = 'red', children}: WithHighlightProps) => {
  const opacity = useRef(new Animated.Value(0)).current;

  Animated.timing(opacity, {
    toValue: 1,
    duration: 150,
    useNativeDriver: true,
  }).start(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  });

  const animatedStyle = useMemo(
    () => ({
      opacity: opacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      borderColor: color,
      borderWidth: 2,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
    [opacity, color],
  );

  return useMemo(() => {
    // console.log(">>>>>> [withHighlight] rerender", color);
    return (
      <View>
        <Animated.View style={animatedStyle} />
        {children}
      </View>
    );
  }, [animatedStyle, children, color]);
});

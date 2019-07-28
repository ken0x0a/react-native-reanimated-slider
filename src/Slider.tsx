/* eslint-disable react-native/no-color-literals */
import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { PanGestureHandler, State as GestureState } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { runSpring } from './utils/spring'

const {
  interpolate,
  add,
  cond,
  diff,
  divide,
  eq,
  event,
  exp,
  lessThan,
  and,
  call,
  block,
  multiply,
  pow,
  set,
  abs,
  clockRunning,
  greaterOrEq,
  lessOrEq,
  sqrt,
  startClock,
  stopClock,
  sub,
  Clock,
  Value,
  Extrapolate,
  diffClamp,
  tan,
  sin,
  spring,
  timing,
  decay,
  defined,
} = Animated

interface SliderProps {
  onChangeValue?: (value: number) => void
  position?: Animated.Value<number>
}

const activeOffsetX = [-10, 10]
const hitSlop = {
  // top: 30,
  // bottom: 30,
  // right: 30,
  // left: 30,
  vertical: 100,
  horizontal: 100,
}
export const Slider: React.FC<SliderProps> = (
  {
    // onChangeValue, position
  },
) => {
  const { handleGestureEvent, handleStyle } = useMemo(() => {
    const translationX = new Value<number>(0)
    const prevTranslationX = new Value<number>(0)
    const velocityX = new Value<number>(0)
    const position = new Value<number>(0)
    const state = new Value<GestureState>(GestureState.UNDETERMINED)

    const clock = new Clock()

    const translateX = block([
      cond(eq(state, GestureState.END), [
        // cond(clockRunning(clock), 0, startClock(clock)),
        runSpring(clock, position, 200, undefined, {
          finished: new Value(0),
          velocity: velocityX,
          position,
          time: new Value(0),
        }),
      ]),
      cond(eq(state, GestureState.BEGAN), [set(prevTranslationX, 0)]),
      cond(eq(state, GestureState.ACTIVE), [
        cond(clockRunning(clock), stopClock(clock)),
        set(position, add(position, sub(translationX, prevTranslationX))),
        set(prevTranslationX, translationX),
      ]),
      position,
    ])
    return {
      translationX,
      state,
      handleGestureEvent: event([
        {
          nativeEvent: {
            translationX,
            velocityX,
            // x,
            state,
          },
        },
      ]),
      handleStyle: { transform: [{ translateX: translateX as any }] },
    }
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.track} />
      <Animated.View style={styles.rail} />
      <View pointerEvents="box-none">
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <PanGestureHandler
            maxPointers={1}
            minPointers={1}
            activeOffsetX={activeOffsetX}
            onHandlerStateChange={handleGestureEvent}
            onGestureEvent={handleGestureEvent}
            hitSlop={hitSlop}
          >
            <Animated.View style={[styles.handle, handleStyle]} />
          </PanGestureHandler>
        </View>
      </View>
    </View>
  )
}

const colors = {
  orange: '#FF653A',
  orangeLight: '#FFC3B2',
  lightGray: '#F1F1F1',
}
const size = 36
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  handle: { width: size, height: size, borderRadius: size / 2, backgroundColor: 'white' },
  track: {
    backgroundColor: colors.lightGray,
    height: 6,
    borderRadius: 3,
  },
  rail: {
    backgroundColor: colors.orange,
    height: 6,
    borderRadius: 3,
  },
})

/* eslint-disable react-native/no-color-literals */
import React, { useMemo } from 'react'
import { Dimensions, Platform, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { PanGestureHandler, State as GestureState } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { runSpring } from './utils/spring'

const {
  interpolate,
  add,
  cond,
  onChange,
  // diff,
  debug,
  neq,
  divide,
  eq,
  event,
  exp,
  and,
  call,
  block,
  multiply,
  pow,
  set,
  abs,
  clockRunning,
  greaterThan,
  greaterOrEq,
  lessThan,
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
const sq = (x: Animated.Adaptable<number>): Animated.Node<number> => multiply(x, x)

const thumbSize = 36
const padding = 20
const windowWidth = Dimensions.get('window').width
const width = windowWidth - padding * 2
const radius = 18
const diameter = radius * 2
const activeOffsetX = [-10, 10]
const hitSlop = {
  // top: 30,
  // bottom: 30,
  // right: 30,
  // left: 30,
  // vertical: 100,
  horizontal: 5,
}

interface SliderProps {
  maxTrackStyle?: StyleProp<ViewStyle>
  maxValue?: number
  minTrackStyle?: StyleProp<ViewStyle>
  minValue?: number
  onIndexChange?: (value: number) => void
  position?: Animated.Value<number>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ThumbComponent?: React.ComponentType<any>
  thumbStyle?: StyleProp<ViewStyle>
  value?: number
}

export const Slider: React.FC<SliderProps> = ({
  value,
  minValue,
  maxValue,
  onIndexChange,
  position: posProps,
  maxTrackStyle = styles.maxTrack,
  minTrackStyle = styles.minTrack,
  thumbStyle = styles.thumb,
  ThumbComponent = View,
}) => {
  const { handleGestureEvent, thumbAnimStyle, maxTrackAnimStyle } = useMemo(() => {
    const translationX = new Value<number>(0)
    const prevTranslationX = new Value<number>(0)
    const velocityX = new Value<number>(0)
    const position = posProps || new Value<number>(radius)
    const state = new Value<GestureState>(GestureState.UNDETERMINED)

    const clock = new Clock()

    // const edgeBehavior = [cond(lessOrEq(position, width), abs(position), sub(width * 2, position))]

    /**
     * snap
     */
    const width_d4 = width / 4
    const points = Array(5)
      .fill(0)
      .map((_, i) => i * width_d4)
    console.debug({ points })

    const toValue = new Value<number>(0)
    const point = new Value<number>(0)
    /**
     * onChange `index`, `prevIndex`
     */
    const index = new Value<number>(0)
    const prevIndex = new Value<number>(0)

    function setSnapPoints(estimate: Animated.Node<number>) {
      const diff = new Value<number>(0)

      return [
        set(diff, abs(sub(points[0] - 1, estimate))),
        ...points.map((pt, i) => {
          const newDiff = abs(sub(pt, estimate))
          return cond(lessThan(newDiff, diff), [
            call([newDiff, diff], ([nd, d]) => {
              console.debug({ nd, d, i, pt })
            }),
            set(diff, newDiff),
            set(point, pt),
            set(index, i),
          ])
        }),
      ]
    }
    function selectSnapPoint() {
      const estimate = new Value<number>(0)
      return [
        set(estimate, add(position, multiply(divide(velocityX, 2), 0.02))),
        ...setSnapPoints(estimate),
        // debug('velocityX', velocityX),
        // debug('estimate', estimate),
        // debug('point', point),
        // ...points.reduce((pv, cpt) => cond(lessThan * abs(sub(cpt, estimate)), pv[0]), [10000, 0]),
        onIndexChange
          ? cond(neq(prevIndex, index), [
              set(prevIndex, index),
              call([index], ([currentIdx]) => onIndexChange(currentIdx)),
            ])
          : 0,
        set(toValue, point),
      ]
    }

    const snapBehavior = [
      cond(clockRunning(clock), 0, selectSnapPoint()),
      runSpring(clock, position, toValue, undefined, {
        finished: new Value(0),
        velocity: velocityX,
        position,
        time: new Value(0),
      }),
    ]
    const translateX = block([
      cond(eq(state, GestureState.END), [
        // cond(clockRunning(clock), 0, startClock(clock)),
        ...snapBehavior,
      ]),
      cond(eq(state, GestureState.BEGAN), [set(prevTranslationX, 0)]),
      cond(eq(state, GestureState.ACTIVE), [
        cond(clockRunning(clock), stopClock(clock)),
        set(position, add(position, sub(translationX, prevTranslationX))),
        set(prevTranslationX, translationX),
      ]),
      // cond(greaterOrEq(position, 0), position, multiply(position, -1)),
      // ...edgeBehavior,
      position,
    ])
    const pos = interpolate(translateX, {
      inputRange: [0, width],
      outputRange: [0, width],
      extrapolate: Extrapolate.CLAMP,
    })
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      thumbAnimStyle: { transform: [{ translateX: pos as any }] },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      maxTrackAnimStyle: { width: pos as any },
      // maxTrackAnimStyle: { left: 0, right: translateX as any, position: 'absolute' as 'absolute' },
    }
  }, [onIndexChange, posProps])

  return (
    <View
      style={[styles.container, { height: thumbSize, width: width || windowWidth - thumbSize }]}
    >
      <View style={styles.absoluteFillCenter} pointerEvents="box-none">
        <View style={minTrackStyle} />
      </View>
      <View style={styles.absoluteFillCenter} pointerEvents="box-none">
        <Animated.View style={[maxTrackStyle, maxTrackAnimStyle]} />
      </View>
      <View style={styles.absoluteFillCenter} pointerEvents="box-none">
        <PanGestureHandler
          maxPointers={1}
          minPointers={1}
          activeOffsetX={activeOffsetX}
          onHandlerStateChange={handleGestureEvent}
          onGestureEvent={handleGestureEvent}
          // hitSlop={hitSlop}
        >
          <Animated.View style={[styles.thumbBox, thumbAnimStyle]}>
            <ThumbComponent style={thumbStyle} />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  )
}

const colors = {
  orange: '#FF653A',
  orangeLight: '#FFC3B2',
  lightGray: '#F1F1F1',
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // paddingHorizontal: padding,
    justifyContent: 'center',
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  absoluteFillCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  thumbBox: {
    margin: -hitSlop.horizontal,
    padding: hitSlop.horizontal,
    borderRadius: radius,
    left: -radius,
  },
  thumb: {
    width: diameter,
    height: diameter,
    borderRadius: radius,
    backgroundColor: colors.orange,
    // left: -radius,
    borderWidth: 1.5,
    borderColor: '#FFF',

    ...Platform.select({
      ios: {
        shadowOpacity: 0.35,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowColor: '#7c7c7c80',
        shadowRadius: 4,
      },
      android: {
        elevation: 7,
      },
    }),
  },
  minTrack: {
    backgroundColor: colors.lightGray,
    height: 6,
    borderRadius: 3,
  },
  maxTrack: {
    backgroundColor: colors.orange,
    height: 6,
    borderRadius: 3,
  },
})

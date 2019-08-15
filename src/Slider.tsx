/* eslint-disable react-native/no-color-literals */
import React, { useMemo } from 'react'
import { Dimensions, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import {
  PanGestureHandler,
  PanGestureHandlerProperties,
  State as GestureState,
} from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { colors } from './styles/colors'
import { runSpring, RunSpringConfig } from './utils/spring'

const {
  interpolate,
  add,
  cond,
  neq,
  divide,
  eq,
  event,
  call,
  block,
  multiply,
  set,
  abs,
  clockRunning,
  lessThan,
  stopClock,
  sub,
  Clock,
  Value,
  Extrapolate,
} = Animated

const DEFAULT_THUMB_SIZE = 27
const DEFAULT_THUMB_BORDER_WIDTH = 2.25
const DEFAULT_MAX_TRACK_HEIGHT = 9
const DEFAULT_MIN_TRACK_HEIGHT = 9

const windowWidth = Dimensions.get('window').width
const DEFAULT_SLIDER_HORIZONTAL_MARGIN = 20
const DEFAULT_SLIDER_WIDTH = windowWidth - DEFAULT_SLIDER_HORIZONTAL_MARGIN * 2

interface SliderStyleProps {
  maxTrackStyle?: StyleProp<ViewStyle>
  minTrackStyle?: StyleProp<ViewStyle>
  thumbContainerStyle?: StyleProp<ViewStyle>
  thumbSize?: number
  thumbStyle?: StyleProp<ViewStyle>
  /** width of the Slider */
  width?: number
}
export interface SliderProps
  extends SliderStyleProps,
    Omit<
      PanGestureHandlerProperties,
      | 'maxPointers'
      | 'minPointers'
      | 'onHandlerStateChange'
      | 'onGestureEvent'
      | 'activeOffsetY'
      | 'failOffsetY'
      | 'maxDeltaY'
      | 'minDeltaY'
      | 'minOffsetY'
      | 'minVelocityY'
    > {
  maxValue?: number
  minValue?: number
  onIndexChange?: (value: number) => void
  position?: Animated.Value<number>
  springConfig?: RunSpringConfig
  step?: number
  ThumbComponent?: React.ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  touchSlop?: number
  value?: number
}

export const Slider: React.FC<SliderProps> = ({
  value,
  minValue = 0,
  maxValue = 10,
  step,
  onIndexChange,
  position: posProps,
  ThumbComponent = View,
  // Styles
  maxTrackStyle = styles.maxTrack,
  minTrackStyle = styles.minTrack,
  thumbContainerStyle: thumbBoxStyle = styles.thumbBox,
  thumbSize = 27,
  thumbStyle = styles.thumb,
  touchSlop = 10,
  width = DEFAULT_SLIDER_WIDTH,
  //
  springConfig,
  activeOffsetX = [-5, 5],
  // ...panGestureProps
}) => {
  const radius = thumbSize / 2

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
    // const numberOfPoints = (maxValue - minValue) / step
    const width_d4 = width / 4
    const points = Array(5)
      .fill(0)
      .map((_, i) => i * width_d4)

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
            // call([newDiff, diff], ([nd, d]) => {
            //   console.debug({ nd, d, i, pt })
            // }),
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
        /**
         * velocityX * 0.01
         */
        set(estimate, add(position, multiply(velocityX, 0.01))),
        ...setSnapPoints(estimate),
        // debug('velocityX', velocityX),
        // debug('estimate', estimate),
        // debug('point', point),
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
      runSpring(clock, position, toValue, springConfig, {
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
      thumbAnimStyle: {
        transform: [{ translateX: pos }],
        ...(touchSlop && { margin: -touchSlop, padding: touchSlop }),
        borderRadius: radius,
        left: -radius,
      },
      maxTrackAnimStyle: { width: pos },
      // maxTrackAnimStyle: { left: 0, right: translateX as any, position: 'absolute' as 'absolute' },
    }
  }, [onIndexChange, posProps, radius, springConfig, touchSlop, width])

  return (
    <View style={[styles.container, { height: thumbSize, width: width || windowWidth - thumbSize }]}>
      <View style={styles.absoluteFillCenter} pointerEvents="box-none">
        <View style={minTrackStyle} />
      </View>
      <View style={styles.absoluteFillCenter} pointerEvents="box-none">
        <Animated.View style={[maxTrackStyle, maxTrackAnimStyle]} />
      </View>
      <View style={[styles.absoluteFillCenterStart]} pointerEvents="box-none">
        <PanGestureHandler
          // {...panGestureProps}
          maxPointers={1}
          minPointers={1}
          activeOffsetX={activeOffsetX}
          onHandlerStateChange={handleGestureEvent}
          onGestureEvent={handleGestureEvent}
          // hitSlop={hitSlop}
        >
          <Animated.View style={[thumbBoxStyle, thumbAnimStyle]}>
            <ThumbComponent style={thumbStyle} />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  )
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
  absoluteFillCenterStart: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  thumbBox: {},
  thumb: {
    width: DEFAULT_THUMB_SIZE,
    height: DEFAULT_THUMB_SIZE,
    borderRadius: DEFAULT_THUMB_SIZE / 2,
    backgroundColor: colors.orange,
    borderWidth: DEFAULT_THUMB_BORDER_WIDTH,
    borderColor: '#FFF',

    ...Platform.select({
      ios: {
        shadowOpacity: 0.35,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowColor: '#7c7c7c80',
        shadowRadius: 6,
      },
      android: {
        elevation: 7,
      },
    }),
  },
  minTrack: {
    backgroundColor: colors.lightGray,
    height: DEFAULT_MIN_TRACK_HEIGHT,
    borderRadius: DEFAULT_MIN_TRACK_HEIGHT / 2,
  },
  maxTrack: {
    backgroundColor: colors.orange,
    height: DEFAULT_MAX_TRACK_HEIGHT,
    borderRadius: DEFAULT_MAX_TRACK_HEIGHT / 2,
  },
})

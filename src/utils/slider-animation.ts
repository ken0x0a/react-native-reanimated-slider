import { useMemo } from 'react'
import { State as GestureState } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { SliderProps } from '../types'
import { runSpring } from './spring'

const {
  abs,
  add,
  block,
  call,
  cond,
  eq,
  event,
  neq,
  interpolate,
  multiply,
  set,
  clockRunning,
  onChange,
  lessThan,
  greaterThan,
  stopClock,
  sub,
  Clock,
  Value,
  Extrapolate,
} = Animated

type PartRequired<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Required<Pick<T, K>>
interface UseGestureHandleAndAnimatedStyleArgs
  extends PartRequired<
    Pick<
      SliderProps,
      | 'initialValue'
      | 'maxValue'
      | 'minValue'
      | 'onIndexChange'
      | 'thumbSize'
      | 'position'
      | 'springConfig'
      | 'step'
      | 'touchSlop'
      | 'width'
    >,
    'maxValue' | 'minValue' | 'thumbSize' | 'touchSlop' | 'width'
  > {}

export function useGestureHandleAndAnimatedStyle({
  initialValue,
  maxValue,
  minValue,
  onIndexChange,
  thumbSize,
  position: posProps,
  springConfig,
  step,
  touchSlop,
  width,
}: UseGestureHandleAndAnimatedStyleArgs) {
  return useMemo(() => {
    const initialPos = initialValue ? getInitialPosition(initialValue, minValue, maxValue, width) : 0
    const radius = thumbSize / 2

    const translationX = new Value<number>(0)
    const prevTranslationX = new Value<number>(0)
    const velocityX = new Value<number>(0)
    const position = posProps || new Value<number>(initialPos)
    const state = new Value<GestureState>(GestureState.UNDETERMINED)

    const clock = new Clock()

    // const edgeBehavior = [cond(lessOrEq(position, width), abs(position), sub(width * 2, position))]

    /**
     * onChange `index`, `prevIndex`
     */
    const index = new Value<number>(0)
    const prevIndex = new Value<number>(0)

    /**
     * snap
     * no `step`, no snap
     */
    const { snapBehavior, crossThresholdBehavior } = getBehaviors({
      step,
      onIndexChange,
      width,
      maxValue,
      minValue,
      clock,
      position,
      springConfig,
      velocityX,
      index,
      prevIndex,
    })

    const translateX = block([
      cond(eq(state, GestureState.END), [
        // cond(clockRunning(clock), 0, startClock(clock)),
        ...snapBehavior,
      ]),
      cond(eq(state, GestureState.BEGAN), [set(prevTranslationX, 0)]),
      cond(eq(state, GestureState.ACTIVE), [
        cond(clockRunning(clock), stopClock(clock)),
        ...crossThresholdBehavior,
        set(position, add(position, sub(translationX, prevTranslationX))),
        set(prevTranslationX, translationX),
      ]),
      ...(step && onIndexChange
        ? [onChange(prevIndex, call([prevIndex], ([currentIdx]) => onIndexChange(currentIdx)))]
        : []),
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
  }, [
    initialValue,
    maxValue,
    minValue,
    onIndexChange,
    posProps,
    springConfig,
    step,
    thumbSize,
    touchSlop,
    width,
  ])
}

function getInitialPosition(
  value: number,
  minValue: number,
  maxValue: number,
  width: number,
): number {
  if (minValue <= value && value <= maxValue) return (value / (maxValue - minValue)) * width

  /**
   * - development mode: throw error
   * - production mode:  return `0`
   */
  if (__DEV__) throw new Error('props.value @ Slider must be between `minValue` and `maxValue')
  return 0
}

/**
 * no `step`, no snap
 */
function getBehaviors({
  step,
  onIndexChange,
  width,
  maxValue,
  minValue,
  springConfig,
  position,
  clock,
  velocityX,
  index,
  prevIndex,
}: Pick<
  UseGestureHandleAndAnimatedStyleArgs,
  'step' | 'onIndexChange' | 'width' | 'maxValue' | 'minValue' | 'springConfig'
> & {
  clock: Animated.Clock
  index: Animated.Value<number>
  position: Animated.Value<number>
  prevIndex: Animated.Value<number>
  velocityX: Animated.Value<number>
}): { crossThresholdBehavior: Animated.Node<number>[]; snapBehavior: Animated.Node<number>[] } {
  if (!step)
    return {
      snapBehavior: onIndexChange
        ? [
            call([position], ([currentPos]) =>
              onIndexChange((currentPos * (maxValue - minValue)) / width + minValue),
            ),
          ]
        : [],
      crossThresholdBehavior: [],
    }
  if (__DEV__ && (maxValue - minValue) % step !== 0)
    throw new Error(
      '`props.step` @ Slider must satisfy `(maxValue - minValue) % step !==0`, currently.',
    )

  const numberOfPoints = (maxValue - minValue) / step
  const width_d0 = width / numberOfPoints
  const points = Array(numberOfPoints + 1)
    .fill(0)
    .map((_, i) => i * width_d0)
  const interval = (step * width) / (maxValue - minValue)
  const interval_d2 = interval / 2

  const crossThresholdBehavior = onIndexChange
    ? [
        points.reduce<Animated.Node<number>>(
          (pv, cv, i) =>
            cond(
              greaterThan(position, cv - interval_d2),
              cond(neq(prevIndex, i), set(prevIndex, i)),
              pv,
            ),
          (0 as unknown) as Animated.Node<number>,
        ),
      ]
    : []

  const toValue = new Value<number>(0)
  const point = new Value<number>(0)

  return {
    crossThresholdBehavior,
    snapBehavior: [
      cond(
        clockRunning(clock),
        0,
        selectSnapPoint({
          onIndexChange,
          position,
          velocityX,
          prevIndex,
          index,
          toValue,
          point,
          points,
          interval_d2,
        }),
      ),
      runSpring(clock, position, toValue, springConfig, {
        finished: new Value(0),
        velocity: velocityX,
        position,
        time: new Value(0),
      }),
    ],
  }
}

function selectSnapPoint({
  onIndexChange,
  position,
  velocityX,
  prevIndex,
  index,
  toValue,
  point,
  points,
  interval_d2,
}: Pick<UseGestureHandleAndAnimatedStyleArgs, 'onIndexChange'> & {
  index: Animated.Value<number>
  interval_d2: number
  point: Animated.Value<number>
  points: number[]
  position: Animated.Value<number>
  prevIndex: Animated.Value<number>
  toValue: Animated.Value<number>
  velocityX: Animated.Value<number>
}) {
  const estimate = new Value<number>(0)
  return [
    /**
     * velocityX * 0.01
     */
    set(estimate, add(position, multiply(velocityX, 0.01))),
    points.reduce<Animated.Node<number>>(
      (pv, cv, i) =>
        pv
          ? cond(
              greaterThan(estimate, cv - interval_d2),
              [onIndexChange ? cond(neq(prevIndex, i), set(prevIndex, i)) : 0, set(toValue, cv)],
              pv,
            )
          : /**
             * special case for `i === 0`,
             * as value of `estimate` might be under `points[0] - interval_d2`.
             */
            block([
              onIndexChange ? cond(neq(prevIndex, i), set(prevIndex, i)) : 0,
              set(toValue, cv),
            ]),
      (0 as unknown) as Animated.Node<number>,
    ),
    // ...setSnapPoints(estimate, points, toValue, prevIndex, interval_d2),
    // debug('velocityX', velocityX),
    // debug('estimate', estimate),
    // debug('point', point),
    // onIndexChange
    //   ? cond(neq(prevIndex, index), [
    //       set(prevIndex, index),
    //       // call([index], ([currentIdx]) => onIndexChange(currentIdx)),
    //     ])
    //   : 0,
    // set(toValue, point),
  ]
}
function setSnapPoints(
  estimate: Animated.Node<number>,
  points: number[],
  toValue: Animated.Value<number>,
  prevIndex: Animated.Value<number>,
  interval_d2: number,
) {
  const diff = new Value<number>(0)

  return [
    points.reduce<Animated.Node<number>>(
      (pv, cv, i) =>
        cond(
          greaterThan(estimate, cv - interval_d2),
          [cond(neq(prevIndex, i), set(prevIndex, i)), set(toValue, cv)],
          pv,
        ),
      (0 as unknown) as Animated.Node<number>,
    ),
    // set(diff, abs(sub(points[0] - 1, estimate))),
    // ...points.map((pt, i) => {
    //   const newDiff = abs(sub(pt, estimate))
    //   return cond(lessThan(newDiff, diff), [
    //     // call([newDiff, diff], ([nd, d]) => {
    //     //   console.debug({ nd, d, i, pt })
    //     // }),
    //     set(diff, newDiff),
    //     set(point, pt),
    //     set(index, i),
    //   ])
    // }),
  ]
}

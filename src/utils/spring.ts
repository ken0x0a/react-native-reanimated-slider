import Animated from 'react-native-reanimated'

const { cond, block, set, clockRunning, startClock, stopClock, Value, spring } = Animated

/**
 *
 * @param clock
 * @param value
 * @param dest
 * @param config
 * https://github.com/kmagiera/react-native-reanimated/#springutilsmakedefaultconfig
 * @param state
 */
export function runSpring(
  clock: Animated.Clock,
  value: Animated.Adaptable<number>,
  dest: Animated.Adaptable<number>,
  config: RunSpringConfig = getDefaultConfig(),
  state: Animated.SpringState = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  },
) {
  const reset = [
    //
    set(state.finished, 0),
    set(state.time, 0),
    set(state.position, value),
  ]

  return block([
    cond(clockRunning(clock), 0, [
      // set(state.velocity, 0),
      ...reset,
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ])
}

export interface RunSpringConfig extends Animated.SpringConfig {
  toValue: Animated.Value<number>
}
export const getDefaultConfig = (): RunSpringConfig => ({
  /**
   * https://github.com/kmagiera/react-native-reanimated/#springutilsmakedefaultconfig
   * ```
   * stiffness: new Value(100),
   * mass: new Value(1),
   * damping: new Value(10),
   * overshootClamping: false,
   * restSpeedThreshold: 0.001,
   * restDisplacementThreshold: 0.001,
   * toValue: new Value(0),
   * ```
   */

  stiffness: 130,
  mass: 0.7,
  damping: 9,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
  toValue: new Value(0),
})

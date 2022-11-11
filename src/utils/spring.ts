import { cond, block, set, clockRunning, startClock, stopClock, Value, spring } from "react-native-reanimated";
import type Animated from "react-native-reanimated";

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
  toValue: Animated.Adaptable<number>,
  baseConfig: SpringBaseConfig = defaultConfig,
  state: Animated.SpringState = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  },
): Animated.Node<number> {
  /** create new object, to avoid accidental reuse. */
  const config: Animated.SpringConfig = { ...baseConfig, toValue };
  const reset = [set(state.finished, 0), set(state.time, 0), set(state.position, value)];

  return block([
    cond(clockRunning(clock), 0, [...reset, startClock(clock)]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
}

export interface SpringBaseConfig extends Omit<Animated.SpringConfig, "toValue"> {}
export const defaultConfig: SpringBaseConfig = {
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
};

import type { ComponentType } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import type { WithSpringConfig } from "react-native-reanimated";

export type SliderStyleProps = {
  maxTrackStyle?: StyleProp<ViewStyle>;
  minTrackStyle?: StyleProp<ViewStyle>;
  thumbContainerStyle?: StyleProp<ViewStyle>;
  thumbSize?: number;
  thumbStyle?: StyleProp<ViewStyle>;
  /** width of the Slider */
  width?: number;
};
export type SliderProps = SliderStyleProps & {
  initialValue?: number;
  maxValue?: number;
  minValue?: number;
  onIndexChange?: (value: number) => void;
  // springConfig?: SpringBaseConfig;
  springConfig?: WithSpringConfig;
  step?: number;
  ThumbComponent?: ComponentType<Pick<ViewProps, "style">>; // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * Controls touchable area.
   * bigger value & larger touch area
   */
  touchSlop?: number;
  activeOffsetX?: number | number[];
};

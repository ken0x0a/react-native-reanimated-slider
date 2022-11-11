import type { ComponentType, RefObject } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { PanGestureHandler, PanGestureHandlerProperties } from "react-native-gesture-handler";
import type Animated from "react-native-reanimated";
import type { SpringBaseConfig } from "./utils/spring";

export type SliderStyleProps = {
  maxTrackStyle?: StyleProp<ViewStyle>;
  minTrackStyle?: StyleProp<ViewStyle>;
  thumbContainerStyle?: StyleProp<ViewStyle>;
  thumbSize?: number;
  thumbStyle?: StyleProp<ViewStyle>;
  /** width of the Slider */
  width?: number;
};
export type SliderProps = SliderStyleProps &
  Omit<
    PanGestureHandlerProperties,
    | "maxPointers"
    | "minPointers"
    | "onHandlerStateChange"
    | "onGestureEvent"
    | "activeOffsetY"
    | "failOffsetY"
    | "maxDeltaY"
    | "minDeltaY"
    | "minOffsetY"
    | "minVelocityY"
  > & {
    initialValue?: number;
    maxValue?: number;
    minValue?: number;
    onIndexChange?: (value: number) => void;
    panRef?: RefObject<PanGestureHandler>;
    position?: Animated.Value<number>;
    springConfig?: SpringBaseConfig;
    step?: number;
    ThumbComponent?: ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    /**
     * Controls touchable area.
     * bigger value & larger touch area
     */
    touchSlop?: number;
  };

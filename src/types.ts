import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { PanGestureHandler, PanGestureHandlerProperties } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { SpringBaseConfig } from './utils/spring'

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
  initialValue?: number
  maxValue?: number
  minValue?: number
  onIndexChange?: (value: number) => void
  panRef?: React.RefObject<PanGestureHandler>
  position?: Animated.Value<number>
  springConfig?: SpringBaseConfig
  step?: number
  ThumbComponent?: React.ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * Controls touchable area.
   * bigger value & larger touch area
   */
  touchSlop?: number
}

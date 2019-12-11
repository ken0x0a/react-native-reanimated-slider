import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { SliderProps } from '../types'
import { colors } from './colors'

interface GenSliderStyles {
  color?: string
  maxTrackColor?: string
  minTrackColor?: string
  thumbBorderColor?: string
  thumbInnerSize?: number
  thumbSize?: number
  trackWidth?: number
}

const borderWidthPerWidth = 1 / 18
const trackWidthRatio = 4 / 18
const thumbInnerSizeRatio = 4 / 18

export function genSliderStyle4({
  thumbSize = 18,
  color: backgroundColor = colors.orange,
  thumbBorderColor = colors.white,
  minTrackColor = colors.lightGray,
  maxTrackColor = colors.orange,
  thumbInnerSize: _thumbInnerSize,
  trackWidth: _trackWidth,
}: GenSliderStyles = {}): SliderProps {
  const radius = thumbSize / 2
  const thumbInnerSize = _thumbInnerSize || thumbInnerSizeRatio * thumbSize
  const innerRadius = thumbInnerSize / 2
  const borderWidth = thumbSize * borderWidthPerWidth
  const trackWidth = _trackWidth || trackWidthRatio * thumbSize
  const trackBorderRadius = trackWidth / 2

  const sliderStylesObject = {
    thumbStyle: {
      width: thumbSize,
      height: thumbSize,
      borderRadius: radius,
      backgroundColor,
      borderColor: thumbBorderColor,
      borderWidth,
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
    },
    minTrackStyle: {
      backgroundColor: minTrackColor,
      height: trackWidth,
      borderRadius: trackBorderRadius,
    },
    maxTrackStyle: {
      backgroundColor: maxTrackColor,
      height: trackWidth,
      borderRadius: trackBorderRadius,
    },
    thumbInner: {
      backgroundColor: colors.white,
      width: thumbInnerSize,
      height: thumbInnerSize,
      borderRadius: innerRadius,
    },
  }

  const { thumbInner, ...sliderStyles } = StyleSheet.create(sliderStylesObject)
  const ThumbComponent: React.FC<ViewProps> = (props) => (
    <View {...props}>
      <View style={thumbInner} />
    </View>
  )
  return { ...sliderStyles, ThumbComponent, thumbSize }
}

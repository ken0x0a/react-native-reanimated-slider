import { StyleSheet } from 'react-native'
import { colors } from './colors'

interface GenSliderStyles {
  color?: string
  maxTrackColor?: string
  minTrackColor?: string
  thumbBorderColor?: string
  thumbSize?: number
  trackWidth?: number
}

const borderWidthPerWidth = 1 / 18

export function genSliderStyle1({
  thumbSize = 18,
  color: backgroundColor = colors.orange,
  thumbBorderColor = colors.white,
  minTrackColor = colors.lightGray,
  maxTrackColor = colors.orange,
  trackWidth = 6,
}: GenSliderStyles = {}) {
  const radius = thumbSize / 2
  const borderWidth = thumbSize * borderWidthPerWidth
  const trackBorderRadius = trackWidth / 2

  const sliderStylesObject = {
    thumbStyle: {
      width: thumbSize,
      height: thumbSize,
      borderRadius: radius,
      backgroundColor,
      borderColor: thumbBorderColor,
      borderWidth,
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
  }

  const sliderStyles = StyleSheet.create(sliderStylesObject)
  return sliderStyles
}

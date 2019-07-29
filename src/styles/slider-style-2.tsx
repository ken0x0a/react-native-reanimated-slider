import { Platform, StyleSheet } from 'react-native'
import { colors } from './colors'

interface GenSliderStyles {
  color?: string
  maxTrackColor?: string
  minTrackBorderColor?: string
  minTrackColor?: string
  thumbBorderColor?: string
  thumbSize?: number
  trackWidth?: number
}
const borderWidthPerWidth = 1 / 18
const trackWidthRatio = 6 / 18

export function genSliderStyle2({
  thumbSize = 18,
  color: backgroundColor = colors.white,
  thumbBorderColor = colors.orange,
  minTrackColor = colors.lightGray,
  minTrackBorderColor = colors.orange,
  maxTrackColor = colors.orange,
  trackWidth: _trackWidth,
}: GenSliderStyles = {}) {
  const radius = thumbSize / 2
  const borderWidth = thumbSize * borderWidthPerWidth
  const trackWidth = _trackWidth || trackWidthRatio * thumbSize
  const trackBorderRadius = trackWidth / 2

  const sliderStylesObject = {
    thumbStyle: {
      width: thumbSize,
      height: thumbSize,
      borderRadius: radius,
      backgroundColor,
      // left: -radius,
      borderWidth,
      borderColor: thumbBorderColor,

      ...Platform.select({
        ios: {
          shadowOpacity: 0.5,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowColor: '#7c7c7c',
          shadowRadius: 4,
        },
        android: {
          elevation: 7,
        },
      }),
    },
    minTrackStyle: {
      backgroundColor: minTrackColor,
      height: trackWidth,
      borderRadius: trackBorderRadius,
      borderWidth: 0.5,
      borderColor: minTrackBorderColor,
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

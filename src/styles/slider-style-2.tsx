import { Platform, StyleSheet } from 'react-native'
import { colors } from './colors'

interface GenSliderStyles {
  color?: string
  maxTrackColor?: string
  minTrackBorderColor?: string
  minTrackColor?: string
  thumbBorderColor?: string
  thumbSize?: number
}
const borderWidthPerWidth = 1 / 18

export function genSliderStyle2({
  thumbSize = 18,
  color: backgroundColor = colors.white,
  thumbBorderColor = colors.orange,
  minTrackColor = colors.lightGray,
  minTrackBorderColor = colors.orange,
  maxTrackColor = colors.orange,
}: GenSliderStyles = {}) {
  const radius = thumbSize / 2
  const borderWidth = thumbSize * borderWidthPerWidth
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
          shadowOpacity: 0.35,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowColor: '#7c7c7c80',
          shadowRadius: 4,
        },
        android: {
          elevation: 7,
        },
      }),
    },
    minTrackStyle: {
      backgroundColor: minTrackColor,
      height: 6,
      borderRadius: 3,
      borderWidth: 0.5,
      borderColor: minTrackBorderColor,
    },
    maxTrackStyle: {
      backgroundColor: maxTrackColor,
      height: 6,
      borderRadius: 3,
    },
  }

  const sliderStyles = StyleSheet.create(sliderStylesObject)
  return sliderStyles
}

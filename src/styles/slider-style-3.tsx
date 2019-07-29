import { StyleSheet } from 'react-native'
import { colors } from './colors'

interface GenSliderStyles {
  color?: string
  manTrackBorderColor?: string
  maxTrackColor?: string
  minTrackColor?: string
  thumbBorderColor?: string
  thumbSize?: number
}
const borderWidthPerWidth = 1 / 18

export function genSliderStyle3({
  thumbSize = 18,
  color: backgroundColor = colors.white,
  thumbBorderColor = colors.orange,
  minTrackColor = colors.orange,
  maxTrackColor = colors.orangeLight,
  manTrackBorderColor = colors.orange,
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
    },
    minTrackStyle: {
      backgroundColor: minTrackColor,
      height: 4,
      borderRadius: 3,
    },
    maxTrackStyle: {
      backgroundColor: maxTrackColor,
      height: 6,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: manTrackBorderColor,
    },
  }

  const sliderStyles = StyleSheet.create(sliderStylesObject)
  return sliderStyles
}

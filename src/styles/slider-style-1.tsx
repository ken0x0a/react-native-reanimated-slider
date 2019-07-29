import { StyleSheet } from 'react-native'
import { colors } from './colors'

interface GenSliderStyles {
  borderColor?: string
  color?: string
  maxTrackColor?: string
  minTrackColor?: string
  thumbSize?: number
}
// 1.5 / 18 => 6.66666666
const borderWidthPerWidth = 1.5 / 18

export function genSliderStyle1({
  thumbSize = 18,
  color: backgroundColor = colors.orange,
  borderColor = colors.white,
  minTrackColor = colors.lightGray,
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
      borderColor,
    },
    minTrackStyle: {
      backgroundColor: minTrackColor,
      height: 6,
      borderRadius: 3,
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

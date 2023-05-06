import { StyleSheet } from "react-native";
import { colors } from "./colors";
import type { SliderStyleProps } from "../types";

interface GenSliderStyles {
  borderColor?: string;
  color?: string;
  maxTrackColor?: string;
  minTrackColor?: string;
  thumbBorderWidth?: number;
  thumbSize?: number;
  trackWidth?: number;
}
// 1.5 / 18 => 6.66666666
const borderWidthPerWidth = 1.5 / 18;
const trackWidthRatio = 6 / 18;

export function genSliderStyle1({
  thumbSize = 18,
  color: backgroundColor = colors.orange,
  borderColor = colors.white,
  minTrackColor = colors.lightGray,
  maxTrackColor = colors.orange,
  //
  thumbBorderWidth,
  trackWidth: _trackWidth,
}: GenSliderStyles = {}): SliderStyleProps {
  const radius = thumbSize / 2;
  const borderWidth =
    typeof thumbBorderWidth === "number" ? thumbBorderWidth : thumbSize * borderWidthPerWidth;
  const trackWidth = _trackWidth || trackWidthRatio * thumbSize;
  const trackBorderRadius = trackWidth / 2;

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
      height: trackWidth,
      borderRadius: trackBorderRadius,
    },
    maxTrackStyle: {
      backgroundColor: maxTrackColor,
      height: trackWidth,
      borderRadius: trackBorderRadius,
    },
  };

  const sliderStyles = StyleSheet.create(sliderStylesObject);
  return { ...sliderStyles, thumbSize };
}

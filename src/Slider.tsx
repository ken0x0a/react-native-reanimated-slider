import React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { colors } from "./styles/colors";
import type { SliderProps } from "./types";

const DEFAULT_THUMB_SIZE = 27;
const DEFAULT_THUMB_BORDER_WIDTH = 2.25;
const DEFAULT_MAX_TRACK_HEIGHT = 9;
const DEFAULT_MIN_TRACK_HEIGHT = 9;

const windowWidth = Dimensions.get("window").width;
const DEFAULT_SLIDER_HORIZONTAL_MARGIN = 20;
const DEFAULT_SLIDER_WIDTH = windowWidth - DEFAULT_SLIDER_HORIZONTAL_MARGIN * 2;

function clamp(value: number, min: number, max: number) {
  "worklet";

  return Math.min(Math.max(value, min), max);
}

export function Slider({
  initialValue,
  minValue = 0,
  maxValue = 10,
  step,
  onIndexChange,
  ThumbComponent = View,
  // Styles
  maxTrackStyle = styles.maxTrack,
  minTrackStyle = styles.minTrack,
  thumbContainerStyle: thumbBoxStyle = styles.thumbBox,
  thumbSize = DEFAULT_THUMB_SIZE,
  thumbStyle = styles.thumb,
  touchSlop = 10,
  width = DEFAULT_SLIDER_WIDTH,
  springConfig,
  activeOffsetX = [-5, 5],
}: SliderProps) {
  // console.debug("Slider rendered ✅");
  const radius = thumbSize / 2;

  const isPressed = useSharedValue(false);
  const translateX = useSharedValue(
    initialValue === undefined ? 0 : ((initialValue - minValue) / (maxValue - minValue)) * width,
  );
  const thumbAnimStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: translateX.value }],
      ...(touchSlop && { margin: -touchSlop, padding: touchSlop }),
      borderRadius: radius,
      left: -radius,
    }),
    [radius],
  );
  const maxTrackAnimStyle = useAnimatedStyle(
    () => ({
      width: translateX.value,
    }),
    [],
  );

  const start = useSharedValue(translateX.value);
  const gesture = Gesture.Pan()
    .hitSlop(touchSlop)
    .maxPointers(1)
    .minPointers(1)
    .activeOffsetX(activeOffsetX)
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((e) => {
      translateX.value = e.translationX + start.value;
    })
    .onEnd((e) => {
      // select snap point
      if (step !== undefined) {
        const numSteps = (maxValue - minValue) / step;
        const interval = width / numSteps;

        /**
         * velocityX * 0.03 makes feel more natural?
         */
        const estimate = translateX.value + e.velocityX * 0.03;
        const toIndex = clamp(Math.round(estimate / interval), 0, numSteps);
        const toValue = toIndex * interval;
        if (onIndexChange) {
          onIndexChange(minValue + toIndex * step);
        }

        translateX.value = withSpring(
          toValue,
          {
            ...springConfig,
            velocity: e.velocityX,
          },
          () => {
            start.value = toValue;
          },
        );
      } else {
        start.value = translateX.value;
        if (onIndexChange) {
          onIndexChange(minValue + translateX.value / (maxValue - minValue));
        }
        // translateX.value = withDecay({ deceleration: 0.97, velocity: e.velocityX, clamp: [0, width] }, () => {
        //   start.value = translateX.value;
        // });
      }
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  return (
    <View style={[styles.container, { height: thumbSize, width: width || windowWidth - thumbSize }]}>
      <View style={styles.absoluteFillCenter} pointerEvents="box-none">
        <View style={minTrackStyle} />
      </View>
      <View style={styles.absoluteFillCenterStart} pointerEvents="box-none">
        <Animated.View style={[maxTrackStyle, maxTrackAnimStyle]} />
      </View>
      <View style={styles.absoluteFillCenterStart} pointerEvents="box-none">
        <GestureDetector gesture={gesture}>
          <Animated.View style={[thumbBoxStyle, thumbAnimStyle]}>
            <ThumbComponent style={thumbStyle} />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  absoluteFillCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },
  absoluteFillCenterStart: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  thumbBox: {},
  thumb: {
    width: DEFAULT_THUMB_SIZE,
    height: DEFAULT_THUMB_SIZE,
    borderRadius: DEFAULT_THUMB_SIZE / 2,
    backgroundColor: colors.orange,
    borderWidth: DEFAULT_THUMB_BORDER_WIDTH,
    borderColor: colors.white,

    ...Platform.select({
      ios: {
        shadowOpacity: 0.35,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowColor: colors.shadow,
        shadowRadius: 6,
      },
      android: {
        elevation: 7,
      },
    }),
  },
  minTrack: {
    backgroundColor: colors.lightGray,
    height: DEFAULT_MIN_TRACK_HEIGHT,
    borderRadius: DEFAULT_MIN_TRACK_HEIGHT / 2,
  },
  maxTrack: {
    backgroundColor: colors.orange,
    height: DEFAULT_MAX_TRACK_HEIGHT,
    borderRadius: DEFAULT_MAX_TRACK_HEIGHT / 2,
  },
});

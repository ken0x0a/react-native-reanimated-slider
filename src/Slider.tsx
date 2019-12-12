import React from 'react'
import { Dimensions, Platform, StyleSheet, View } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { colors } from './styles/colors'
import { SliderProps } from './types'
import { useGestureHandleAndAnimatedStyle } from './utils/slider-animation'

const DEFAULT_THUMB_SIZE = 27
const DEFAULT_THUMB_BORDER_WIDTH = 2.25
const DEFAULT_MAX_TRACK_HEIGHT = 9
const DEFAULT_MIN_TRACK_HEIGHT = 9

const windowWidth = Dimensions.get('window').width
const DEFAULT_SLIDER_HORIZONTAL_MARGIN = 20
const DEFAULT_SLIDER_WIDTH = windowWidth - DEFAULT_SLIDER_HORIZONTAL_MARGIN * 2

export const Slider: React.FC<SliderProps> = ({
  initialValue,
  minValue = 0,
  maxValue = 10,
  step,
  onIndexChange,
  position: posProps,
  ThumbComponent = View,
  // Styles
  maxTrackStyle = styles.maxTrack,
  minTrackStyle = styles.minTrack,
  thumbContainerStyle: thumbBoxStyle = styles.thumbBox,
  thumbSize = DEFAULT_THUMB_SIZE,
  thumbStyle = styles.thumb,
  touchSlop = 10,
  width = DEFAULT_SLIDER_WIDTH,
  //
  springConfig,
  panRef,
  activeOffsetX = [-5, 5],
  ...panGestureProps
}) => {
  const { handleGestureEvent, thumbAnimStyle, maxTrackAnimStyle } = useGestureHandleAndAnimatedStyle(
    {
      initialValue,
      maxValue,
      minValue,
      onIndexChange,
      thumbSize,
      position: posProps,
      springConfig,
      step,
      touchSlop,
      width,
    },
  )

  return (
    <View style={[styles.container, { height: thumbSize, width: width || windowWidth - thumbSize }]}>
      <View style={styles.absoluteFillCenter} pointerEvents="box-none">
        <View style={minTrackStyle} />
      </View>
      <View style={styles.absoluteFillCenterStart} pointerEvents="box-none">
        <Animated.View style={[maxTrackStyle, maxTrackAnimStyle]} />
      </View>
      <View style={styles.absoluteFillCenterStart} pointerEvents="box-none">
        <PanGestureHandler
          {...panGestureProps}
          ref={panRef}
          maxPointers={1}
          minPointers={1}
          activeOffsetX={activeOffsetX}
          onHandlerStateChange={handleGestureEvent}
          onGestureEvent={handleGestureEvent}
          // hitSlop={hitSlop}
        >
          <Animated.View style={[thumbBoxStyle, thumbAnimStyle]}>
            <ThumbComponent style={thumbStyle} />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  absoluteFillCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  absoluteFillCenterStart: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
})

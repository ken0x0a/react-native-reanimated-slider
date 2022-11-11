[![GitHub Action](https://github.com/ken0x0a/react-native-reanimated-slider/actions/workflows/publish.yml/badge.svg)](https://github.com/ken0x0a/react-native-reanimated-slider/actions)
[![npm version](https://img.shields.io/npm/v/react-native-re-slider?color=%234FC73C)](https://www.npmjs.com/package/react-native-re-slider)

---

- [Usage](#usage)
- [Components](#components)
  - [1. `<Slider />`](#1-slider)
    - [Style presets](#style-presets)
- [Status](#status)

---

## Usage

```sh
yarn add react-native-re-slider
```


## Components

### 1. `<Slider />`

Slider component.

```tsx
import { Slider, genSliderStyle1, genSliderStyle2 } from 'react-native-reanimated-slider'

<Slider {...sliderStyles.genSliderStyle1({ thumbSize: 27, thumbBorderWidth: 0 })} />
<Slider {...sliderStyles.genSliderStyle2()} />

// NOTE: Slider is just FunctionalComponent, doesn't wrapped by React.memo
const SliderMemo = React.memo(Slider, (prevProps, nextProps) => true)
<SliderMemo {...sliderStyles.genSliderStyle2()} />
// ...
```

#### Style presets

- genSliderStyle1
- genSliderStyle2
- genSliderStyle3
- genSliderStyle4


## Status

If anyone interested in adding new components or features, I appreciate the PR 🙌, But I'm not sure what can be added though.

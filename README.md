[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

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

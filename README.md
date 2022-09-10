## 목적
- 리렌더 되는 컴포넌트 강조
- 관련 테스트

## 시작
- `yarn add @jiggag/react-native-highlight-updates`

## 설명
| 이름       | 타입            | 설명               |
|----------|---------------|------------------|
| color    | string?       | 리렌더 상태 구분 테두리 색상 |
| children | ReactElement? | 테스트 대상           |


```tsx
import {WithHighlight} from '@jiggag/react-native-highlight-updates';

...

<WithHighlight>
  <TestComponent1 />
</WithHighlight>
<WithHighlight color="blue">
  <TestComponent2 />
</WithHighlight>
```

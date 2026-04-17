import { ColorValue, View } from 'react-native'

type Props = {
  color: ColorValue
  height?: number
  width?: number
}

export function Separator({ color, height = 24, width = 1 }: Props) {
  return <View style={{ backgroundColor: color, height, width }} />
}

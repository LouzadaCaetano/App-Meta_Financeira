import { View } from 'react-native'
import { colors } from '@/theme/colors'

type Props = {
  percentage: number
}

export function Progress({ percentage }: Props) {
  const safe = Math.max(0, Math.min(percentage, 100))

  return (
    <View
      style={{
        width: '100%',
        height: 10,
        backgroundColor: colors.gray[100],
        borderRadius: 999,
      }}
    >
      <View
        style={{
          height: 10,
          width: `${safe}%`,
          backgroundColor: colors.blue[500],
          borderRadius: 999,
        }}
      />
    </View>
  )
}

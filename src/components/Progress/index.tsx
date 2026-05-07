import { Text, View } from 'react-native'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'
import { formatPercentage } from '@/utils/format'

type Props = {
  percentage: number
  showValue?: boolean
}

export function Progress({ percentage, showValue = false }: Props) {
  const safe = Math.max(0, Math.min(percentage, 100))

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <View
        style={{
          flex: 1,
          height: 7,
          backgroundColor: colors.gray[200],
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: 7,
            width: `${safe}%`,
            backgroundColor: colors.blue[500],
            borderRadius: 999,
          }}
        />
      </View>

      {showValue && (
        <Text
          style={{
            minWidth: 34,
            color: colors.gray[600],
            fontSize: 12,
            textAlign: 'right',
            fontFamily: fontFamily.medium,
          }}
        >
          {`${formatPercentage(safe)}%`}
        </Text>
      )}
    </View>
  )
}

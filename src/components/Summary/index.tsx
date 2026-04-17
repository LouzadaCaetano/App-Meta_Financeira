import { ColorValue, Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'

export type SummaryData = {
  label: string
  value: string
}

type Props = {
  data: SummaryData
  icon: {
    name: keyof typeof MaterialIcons.glyphMap
    color: ColorValue
  }
  alignRight?: boolean
}

export function Summary({ data, icon, alignRight = false }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          alignItems: 'center',
          justifyContent: alignRight ? 'flex-end' : 'flex-start',
        }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.12)',
          }}
        >
          <MaterialIcons name={icon.name} size={14} color={icon.color} />
        </View>

        <Text
          style={{
            color: 'rgba(255,255,255,0.82)',
            fontSize: 12,
            fontFamily: fontFamily.medium,
          }}
        >
          {data.label}
        </Text>
      </View>

      <Text
        style={{
          color: colors.white,
          fontSize: 18,
          fontFamily: fontFamily.bold,
          marginTop: 8,
          textAlign: alignRight ? 'right' : 'left',
        }}
      >
        {data.value}
      </Text>
    </View>
  )
}

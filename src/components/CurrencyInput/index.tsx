import { Text, View } from 'react-native'
import CurrencyInputLib from 'react-native-currency-input'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'

type Props = {
  label: string
  value: number | null
  onChangeValue?: (value: number | null) => void
}

export function CurrencyInput({ label, value, onChangeValue }: Props) {
  return (
    <View style={{ width: '100%', gap: 10 }}>
      <Text
        style={{
          color: colors.gray[500],
          fontSize: 12,
          fontFamily: fontFamily.medium,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          height: 56,
          width: '100%',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.gray[400],
          justifyContent: 'center',
          paddingHorizontal: 16,
        }}
      >
        <CurrencyInputLib
          value={value}
          onChangeValue={onChangeValue}
          delimiter="."
          separator=","
          precision={2}
          prefix=""
          placeholder="0,00"
          placeholderTextColor={colors.gray[500]}
          style={{
            fontFamily: fontFamily.regular,
            fontSize: 16,
            color: colors.black,
          }}
        />
      </View>
    </View>
  )
}

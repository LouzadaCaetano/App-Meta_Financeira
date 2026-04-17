import { Text, TextInput, TextInputProps, View } from 'react-native'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'

type Props = TextInputProps & {
  label: string
}

export function Input({ label, ...rest }: Props) {
  return (
    <View style={{ width: '100%', gap: 10 }}>
      <Text
        style={{
          color: colors.gray[500],
          fontSize: 12,
          fontFamily: fontFamily.medium,
          letterSpacing: 0.2,
        }}
      >
        {label}
      </Text>

      <TextInput
        style={{
          height: 58,
          width: '100%',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.gray[200],
          backgroundColor: colors.gray[50],
          paddingHorizontal: 16,
          fontFamily: fontFamily.regular,
          fontSize: 16,
          color: colors.black,
        }}
        placeholderTextColor={colors.gray[400]}
        {...rest}
      />
    </View>
  )
}

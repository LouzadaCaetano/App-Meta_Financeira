import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'

type Props = PressableProps & {
  title: string
  isLoading?: boolean
}

export function Button({
  title,
  isLoading = false,
  disabled = false,
  style,
  ...rest
}: Props) {
  const isDisabled = isLoading || disabled

  return (
    <Pressable
      style={({ pressed }) => [
        {
          height: 56,
          width: '100%',
          borderRadius: 12,
          backgroundColor: colors.blue[500],
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDisabled ? 0.7 : pressed ? 0.9 : 1,
        },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <Text
          style={{
            color: colors.white,
            fontSize: 16,
            fontFamily: fontFamily.bold,
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  )
}

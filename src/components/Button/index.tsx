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
          height: 58,
          width: '100%',
          borderRadius: 18,
          backgroundColor: colors.blue[500],
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.blue[900],
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.16,
          shadowRadius: 18,
          elevation: 4,
          opacity: isDisabled ? 0.65 : pressed ? 0.92 : 1,
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
            letterSpacing: 0.2,
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  )
}

import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'

type Props = PressableProps & {
  title: string
  isLoading?: boolean
}

export function Button({ title, isLoading = false, ...rest }: Props) {
  return (
    <Pressable
      style={{
        height: 56,
        width: '100%',
        borderRadius: 12,
        backgroundColor: colors.blue[500],
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isLoading ? 0.7 : 1,
      }}
      disabled={isLoading}
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

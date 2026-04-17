import { FlatList, FlatListProps, Text, View, ViewStyle } from 'react-native'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'

type Props<T> = FlatListProps<T> & {
  title: string
  emptyMessage: string
  containerStyle?: ViewStyle
}

export function List<T>({
  title,
  emptyMessage,
  containerStyle,
  data,
  ...rest
}: Props<T>) {
  const isEmpty = !data || data.length === 0

  return (
    <View style={[{ width: '100%' }, containerStyle]}>
      <Text
        style={{
          fontFamily: fontFamily.bold,
          fontSize: 18,
          marginBottom: 12,
          color: colors.black,
        }}
      >
        {title}
      </Text>

      {isEmpty ? (
        <Text
          style={{
            color: colors.gray[500],
            fontFamily: fontFamily.regular,
          }}
        >
          {emptyMessage}
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(_, index) => String(index)}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          {...rest}
        />
      )}
    </View>
  )
}

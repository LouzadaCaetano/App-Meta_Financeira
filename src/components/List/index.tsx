import { FlatList, FlatListProps, Text, View, ViewStyle } from 'react-native'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'

type Props<T> = FlatListProps<T> & {
  title: string
  emptyMessage: string
  containerStyle?: ViewStyle
}

type WithOptionalId = {
  id?: string | number
}

export function List<T>({
  title,
  emptyMessage,
  containerStyle,
  data,
  keyExtractor,
  ...rest
}: Props<T>) {
  const isEmpty = !data || data.length === 0

  const defaultKeyExtractor = (item: T, index: number) => {
    if (typeof item === 'object' && item !== null && 'id' in item) {
      return String((item as WithOptionalId).id ?? index)
    }

    return String(index)
  }

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
          keyExtractor={keyExtractor ?? defaultKeyExtractor}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          showsVerticalScrollIndicator={false}
          {...rest}
        />
      )}
    </View>
  )
}

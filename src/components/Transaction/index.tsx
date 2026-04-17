import { MaterialIcons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'
import { TransactionTypes } from '@/utils/TransactionTypes'

export type TransactionData = {
  id: string
  title: string
  value: string
  type: TransactionTypes
  date?: string
  description?: string
}

type Props = {
  data: TransactionData
  onRemove?: () => void
  hideBorder?: boolean
}

export function Transaction({ data, onRemove, hideBorder = false }: Props) {
  const isInput = data.type === TransactionTypes.Input

  return (
    <View
      style={{
        width: '100%',
        paddingVertical: 14,
        borderBottomWidth: hideBorder ? 0 : 1,
        borderBottomColor: colors.gray[200],
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 14,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 12, flex: 1 }}>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isInput ? '#E9F8EF' : '#FCECEC',
          }}
        >
          <MaterialIcons
            name={isInput ? 'arrow-upward' : 'arrow-downward'}
            size={16}
            color={isInput ? colors.green[500] : colors.red[500]}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.black,
              fontSize: 15,
              fontFamily: fontFamily.bold,
            }}
          >
            {data.value}
          </Text>

          <Text
            style={{
              marginTop: 2,
              color: colors.gray[600],
              fontSize: 12,
              fontFamily: fontFamily.medium,
            }}
          >
            {data.title}
            {data.date ? ` • ${data.date}` : ''}
          </Text>

          {!!data.description && (
            <Text
              style={{
                marginTop: 6,
                color: colors.gray[500],
                fontSize: 12,
                lineHeight: 17,
                fontFamily: fontFamily.regular,
              }}
            >
              {data.description}
            </Text>
          )}
        </View>
      </View>

      {!!onRemove && (
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            paddingTop: 2,
          })}
        >
          <MaterialIcons name="delete-outline" size={20} color={colors.gray[400]} />
        </Pressable>
      )}
    </View>
  )
}

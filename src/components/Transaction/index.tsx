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
}

type Props = {
  data: TransactionData
  onRemove?: () => void
}

export function Transaction({ data, onRemove }: Props) {
  const isInput = data.type === TransactionTypes.Input

  return (
    <View
      style={{
        width: '100%',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray[100],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <MaterialIcons
          name={isInput ? 'arrow-upward' : 'arrow-downward'}
          size={18}
          color={isInput ? colors.blue[500] : colors.red[400]}
        />

        <View>
          <Text style={{ fontFamily: fontFamily.medium, color: colors.black }}>
            {data.title}
          </Text>
          <Text style={{ marginTop: 4, color: colors.gray[500] }}>
            {data.value}
          </Text>
        </View>
      </View>

      {!!onRemove && (
        <Pressable onPress={onRemove}>
          <MaterialIcons name="delete" size={20} color={colors.gray[500]} />
        </Pressable>
      )}
    </View>
  )
}

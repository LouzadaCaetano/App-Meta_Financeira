import { View } from 'react-native'
import { TransactionTypes } from '@/utils/TransactionTypes'
import { Option } from './option'

type Props = {
  selected: TransactionTypes
  onChange: (type: TransactionTypes) => void
}

export function TransactionType({ selected, onChange }: Props) {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Option
        title="Guardar"
        icon="arrow-upward"
        isSelected={selected === TransactionTypes.Input}
        onPress={() => onChange(TransactionTypes.Input)}
      />

      <Option
        title="Resgatar"
        icon="arrow-downward"
        isSelected={selected === TransactionTypes.Output}
        onPress={() => onChange(TransactionTypes.Output)}
      />
    </View>
  )
}

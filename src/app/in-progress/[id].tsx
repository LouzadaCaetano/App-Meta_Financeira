import { View } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { Button } from '@/components/Button'
import { Progress } from '@/components/Progress'
import { List } from '@/components/List'
import { Transaction, TransactionData } from '@/components/Transaction'
import { TransactionTypes } from '@/utils/TransactionTypes'

const details = {
  current: 'R$ 580,00',
  target: 'R$ 1.780,00',
  percentage: 25,
}

const transactions: TransactionData[] = [
  { id: 't1', title: 'Guardado', value: 'R$ 300,00', type: TransactionTypes.Input },
  { id: 't2', title: 'Resgatado', value: 'R$ 20,00', type: TransactionTypes.Output },
]

export default function InProgress() {
  const params = useLocalSearchParams<{ id: string }>()

  return (
    <View style={{ flex: 1, padding: 24, gap: 24 }}>
      <View>
        <Progress percentage={details.percentage} />
      </View>

      <List
        title={`Transações da meta ${params.id}`}
        data={transactions}
        renderItem={({ item }) => <Transaction data={item} onRemove={() => {}} />}
        emptyMessage="Nenhuma transação. Toque em nova transação para guardar seu primeiro dinheiro aqui."
      />

      <Button
        title="Nova transação"
        onPress={() => router.navigate(`/transaction/${params.id}`)}
      />
    </View>
  )
}

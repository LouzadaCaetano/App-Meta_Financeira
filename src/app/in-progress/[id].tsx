import { Pressable, Text, View } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/components/Button'
import { Progress } from '@/components/Progress'
import { List } from '@/components/List'
import { Transaction, TransactionData } from '@/components/Transaction'
import { colors, fontFamily } from '@/theme'
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
  const targetId = Array.isArray(params.id) ? params.id[0] : params.id ?? ''

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 24, gap: 24 }}>
        <Pressable onPress={() => router.back()}>
          <Text
            style={{
              color: colors.black,
              fontSize: 16,
              fontFamily: fontFamily.medium,
            }}
          >
            Voltar
          </Text>
        </Pressable>

        <View style={{ gap: 4 }}>
          <Text
            style={{
              color: colors.gray[600],
              fontSize: 14,
              fontFamily: fontFamily.regular,
            }}
          >
            Meta em andamento
          </Text>
          <Text
            style={{
              color: colors.black,
              fontSize: 28,
              fontFamily: fontFamily.bold,
            }}
          >
            Meta {targetId}
          </Text>
          <Text
            style={{
              color: colors.gray[500],
              fontSize: 14,
              fontFamily: fontFamily.regular,
            }}
          >
            {details.current} de {details.target}
          </Text>
        </View>

        <Progress percentage={details.percentage} />

        <List
          title={`Transações da meta ${targetId}`}
          data={transactions}
          renderItem={({ item }) => <Transaction data={item} />}
          keyExtractor={(item) => item.id}
          emptyMessage="Nenhuma transação. Toque em nova transação para guardar seu primeiro dinheiro aqui."
        />

        <Button
          title="Nova transação"
          onPress={() => router.navigate(`/transaction/${targetId}`)}
        />
      </View>
    </SafeAreaView>
  )
}

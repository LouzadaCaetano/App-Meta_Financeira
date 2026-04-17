import { MaterialIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/components/Button'
import { Progress } from '@/components/Progress'
import { Transaction, TransactionData } from '@/components/Transaction'
import { colors, fontFamily } from '@/theme'
import { TransactionTypes } from '@/utils/TransactionTypes'

const goals = {
  '1': {
    name: 'Viagem para o Rio',
    current: 'R$ 580,00',
    target: 'R$ 1.780,00',
    percentage: 25,
  },
  '2': {
    name: 'Notebook',
    current: 'R$ 1.200,00',
    target: 'R$ 4.000,00',
    percentage: 30,
  },
}

const transactionsByGoal: Record<string, TransactionData[]> = {
  '1': [
    {
      id: 't1',
      title: 'Guardar',
      value: 'R$ 300,00',
      type: TransactionTypes.Input,
      date: '12 abr 2026',
      description: 'Transferencia feita para acelerar a reserva da viagem.',
    },
    {
      id: 't2',
      title: 'Resgatar',
      value: 'R$ 20,00',
      type: TransactionTypes.Output,
      date: '08 abr 2026',
      description: 'Ajuste pontual para cobrir um gasto inesperado.',
    },
  ],
  '2': [
    {
      id: 't3',
      title: 'Guardar',
      value: 'R$ 500,00',
      type: TransactionTypes.Input,
      date: '05 abr 2026',
      description: 'Parte do bonus mensal direcionado para o notebook.',
    },
  ],
}

export default function InProgress() {
  const params = useLocalSearchParams<{ id: string }>()
  const targetId = Array.isArray(params.id) ? params.id[0] : params.id ?? '1'
  const goal = goals[targetId as keyof typeof goals] ?? goals['1']
  const transactions = transactionsByGoal[targetId] ?? transactionsByGoal['1']

  function handleBack() {
    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace('/')
  }

  function handleEdit() {
    router.navigate({ pathname: '/target', params: { id: targetId } })
  }

  function handleNewTransaction() {
    router.navigate(`/transaction/${targetId}`)
  }

  function handleRemoveTransaction(transaction: TransactionData) {
    Alert.alert(
      'Remocao indisponivel',
      `A exclusao de "${transaction.title}" ainda nao foi implementada nesta etapa.`,
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topBar}>
          <Pressable
            onPress={handleBack}
            hitSlop={8}
            style={({ pressed }) => [styles.topAction, pressed && styles.topActionPressed]}
          >
            <MaterialIcons name="arrow-back-ios-new" size={18} color={colors.black} />
            <Text style={styles.topActionLabel}>Voltar</Text>
          </Pressable>

          <Pressable
            onPress={handleEdit}
            hitSlop={8}
            style={({ pressed }) => [
              styles.topAction,
              styles.secondaryAction,
              pressed && styles.topActionPressed,
            ]}
          >
            <Text style={styles.editActionLabel}>Editar</Text>
            <MaterialIcons name="edit" size={18} color={colors.blue[500]} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{goal.name}</Text>
            <Text style={styles.supportText}>Valor guardado</Text>
            <Text style={styles.amountText}>
              {goal.current} <Text style={styles.amountMuted}>de {goal.target}</Text>
            </Text>
          </View>

          <Progress percentage={goal.percentage} showValue />

          <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>Transacoes</Text>

            <View style={styles.transactionsList}>
              {transactions.map((item) => (
                <Transaction
                  key={item.id}
                  data={item}
                  onRemove={() => handleRemoveTransaction(item)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Nova transacao" onPress={handleNewTransaction} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 28,
  },
  topAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  secondaryAction: {
    minWidth: 56,
    justifyContent: 'flex-end',
  },
  topActionPressed: {
    opacity: 0.7,
  },
  topActionLabel: {
    color: colors.black,
    fontSize: 15,
    fontFamily: fontFamily.medium,
  },
  editActionLabel: {
    color: colors.blue[500],
    fontSize: 15,
    fontFamily: fontFamily.medium,
  },
  scrollContent: {
    paddingTop: 28,
    paddingBottom: 24,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  title: {
    color: colors.black,
    fontSize: 32,
    lineHeight: 38,
    fontFamily: fontFamily.bold,
    letterSpacing: -0.8,
  },
  supportText: {
    marginTop: 6,
    color: colors.gray[500],
    fontSize: 13,
    fontFamily: fontFamily.medium,
  },
  amountText: {
    color: colors.black,
    fontSize: 22,
    fontFamily: fontFamily.bold,
  },
  amountMuted: {
    color: colors.gray[500],
    fontSize: 16,
    fontFamily: fontFamily.medium,
  },
  transactionsSection: {
    gap: 14,
  },
  sectionTitle: {
    color: colors.black,
    fontSize: 18,
    fontFamily: fontFamily.bold,
  },
  transactionsList: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  footer: {
    paddingTop: 12,
  },
})

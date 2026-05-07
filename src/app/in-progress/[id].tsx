import { MaterialIcons } from '@expo/vector-icons'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback, useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/components/Button'
import { Loading } from '@/components/Loading'
import { Progress } from '@/components/Progress'
import { Transaction, TransactionData } from '@/components/Transaction'
import { Target, Transaction as TransactionModel } from '@/database/types'
import { useTargetDatabase } from '@/database/useTargetDatabase'
import { useTransactionsDatabase } from '@/database/useTransactionsDatabase'
import { colors, fontFamily } from '@/theme'
import { TransactionTypes } from '@/utils/TransactionTypes'
import { formatCurrency, formatDateShort, formatSignedCurrency } from '@/utils/format'

export default function InProgress() {
  const params = useLocalSearchParams<{ id: string }>()
  const rawTargetId = Array.isArray(params.id) ? params.id[0] : params.id
  const targetId = rawTargetId ? Number(rawTargetId) : null
  const targetDatabase = useTargetDatabase()
  const transactionsDatabase = useTransactionsDatabase()
  const [target, setTarget] = useState<Target | null>(null)
  const [transactions, setTransactions] = useState<TransactionModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function loadData() {
    if (!Number.isInteger(targetId) || (targetId ?? 0) <= 0) {
      router.replace('/')
      return
    }

    const currentTargetId = targetId as number

    try {
      const [nextTarget, nextTransactions] = await Promise.all([
        targetDatabase.show(currentTargetId),
        transactionsDatabase.listByTargetId(currentTargetId),
      ])

      if (!nextTarget) {
        router.replace('/')
        return
      }

      setTarget(nextTarget)
      setTransactions(nextTransactions)
    } catch (error) {
      console.warn('[InProgress] Falha ao carregar detalhes da meta.', error)
      Alert.alert('Erro', 'Não foi possível carregar os dados da meta.')
      router.replace('/')
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true)
      void loadData()
    }, [targetId]),
  )

  const transactionItems: TransactionData[] = transactions.map((item) => ({
    id: String(item.id),
    title: item.amount >= 0 ? 'Valor guardado' : 'Valor resgatado',
    value: formatSignedCurrency(item.amount),
    type: item.amount >= 0 ? TransactionTypes.Input : TransactionTypes.Output,
    date: formatDateShort(item.created_at),
    description: item.observation,
  }))

  function handleBack() {
    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace('/')
  }

  function handleEdit() {
    if (!target) {
      router.replace('/')
      return
    }

    router.navigate({ pathname: '/target', params: { id: String(targetId) } })
  }

  function handleNewTransaction() {
    if (!target) {
      router.replace('/')
      return
    }

    router.navigate(`/transaction/${targetId}`)
  }

  function handleRemoveTransaction(transactionId: string) {
    Alert.alert('Excluir transação', 'Deseja remover esta transação?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await transactionsDatabase.remove(Number(transactionId))
            await loadData()
          } catch (error) {
            console.warn('[InProgress] Falha ao excluir transação.', error)
            Alert.alert('Erro', 'Não foi possível excluir a transação.')
          }
        },
      },
    ])
  }

  if (isLoading) {
    return <Loading />
  }

  if (!target) {
    return null
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

        <View style={styles.summarySection}>
          <View style={styles.header}>
            <Text style={styles.title}>{target.name}</Text>
            <Text style={styles.supportText}>Valor guardado</Text>
            <Text style={styles.amountText}>
              {formatCurrency(target.current)}{' '}
              <Text style={styles.amountMuted}>de {formatCurrency(target.amount)}</Text>
            </Text>
          </View>

          <Progress percentage={target.percentage} showValue />
        </View>

        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Transações</Text>

          <View style={styles.transactionsList}>
            <FlatList
              data={transactionItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <Transaction
                  data={item}
                  onRemove={() => handleRemoveTransaction(item.id)}
                  hideBorder={index === transactionItems.length - 1}
                />
              )}
              ListEmptyComponent={
                <Text style={styles.emptyMessage}>
                  Nenhuma transação registrada para esta meta.
                </Text>
              }
              contentContainerStyle={[
                styles.transactionsListContent,
                transactionItems.length === 0 && styles.transactionsListEmptyContent,
              ]}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Button title="Nova transação" onPress={handleNewTransaction} />
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
  summarySection: {
    paddingTop: 28,
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
    flex: 1,
    paddingTop: 24,
    gap: 14,
  },
  sectionTitle: {
    color: colors.black,
    fontSize: 18,
    fontFamily: fontFamily.bold,
  },
  transactionsList: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  transactionsListContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  transactionsListEmptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyMessage: {
    color: colors.gray[500],
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.regular,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  footer: {
    paddingTop: 12,
  },
})

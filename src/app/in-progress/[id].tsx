import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { colors, fontFamily } from '@/theme'

const transactions = [
  { id: '1', type: 'out', value: 20, date: '12/04/25', description: '' },
  { id: '2', type: 'in', value: 300, date: '12/04/25', description: 'CBD de 110% no banco XPTO' },
  { id: '3', type: 'in', value: 300, date: '12/04/25', description: 'CBD de 110% no banco XPTO' },
]

export default function InProgress() {
  const params = useLocalSearchParams<{ id: string }>()
  const current = 580
  const goal = 1790
  const progress = Math.max(0, Math.min(100, (current / goal) * 100))

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.back} onPress={() => router.back()}>
          Voltar
        </Text>

        <Text style={styles.title}>Meta em andamento</Text>
        <Text style={styles.metaName}>Apple Watch</Text>
        <Text style={styles.savedLabel}>Valor guardado</Text>
        <Text style={styles.savedValue}>
          {current.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} de{' '}
          {goal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Text>

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transações da meta {params.id}</Text>

          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View>
                <Text
                  style={[
                    styles.transactionValue,
                    transaction.type === 'in' ? styles.positive : styles.negative,
                  ]}
                >
                  {transaction.type === 'in' ? '↑' : '↓'}{' '}
                  {transaction.value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
                <Text style={styles.transactionDate}>
                  {transaction.date}
                  {transaction.description ? ` • ${transaction.description}` : ''}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Text
          style={styles.button}
          onPress={() => router.navigate(`/transaction/${params.id}`)}
        >
          Nova transação
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 14,
  },
  back: {
    color: colors.black,
    fontSize: 16,
    fontFamily: fontFamily.medium,
  },
  title: {
    fontSize: 14,
    color: colors.gray[600],
    fontFamily: fontFamily.regular,
  },
  metaName: {
    fontSize: 28,
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  savedLabel: {
    fontSize: 12,
    color: colors.gray[500],
    fontFamily: fontFamily.regular,
  },
  savedValue: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fontFamily.medium,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.gray[300],
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.blue[500],
  },
  progressText: {
    fontSize: 13,
    color: colors.blue[500],
    fontFamily: fontFamily.bold,
  },
  section: {
    marginTop: 8,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  transactionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  transactionValue: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
    marginBottom: 4,
  },
  positive: {
    color: colors.blue[500],
  },
  negative: {
    color: colors.red[500],
  },
  transactionDate: {
    fontSize: 12,
    color: colors.gray[600],
    fontFamily: fontFamily.regular,
  },
  button: {
    marginTop: 'auto',
    backgroundColor: colors.blue[500],
    color: colors.white,
    textAlign: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    overflow: 'hidden',
    fontFamily: fontFamily.bold,
    fontSize: 15,
  },
})

import { MaterialIcons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button } from '@/components/Button'
import { HomeHeader } from '@/components/HomeHeader'
import { Loading } from '@/components/Loading'
import { Progress } from '@/components/Progress'
import { Target, TransactionsSummary } from '@/database/types'
import { useTargetDatabase } from '@/database/useTargetDatabase'
import { useTransactionsDatabase } from '@/database/useTransactionsDatabase'
import { colors, fontFamily } from '@/theme'
import { formatCurrency, formatSignedCurrency } from '@/utils/format'

export default function Index() {
  const targetDatabase = useTargetDatabase()
  const transactionsDatabase = useTransactionsDatabase()
  const [targets, setTargets] = useState<Target[] | null>(null)
  const [summary, setSummary] = useState<TransactionsSummary | null>(null)

  async function loadData() {
    try {
      const [nextTargets, nextSummary] = await Promise.all([
        targetDatabase.list(),
        transactionsDatabase.getSummary(),
      ])

      setTargets(nextTargets)
      setSummary(nextSummary)
    } catch (error) {
      console.warn('[Home] Falha ao carregar metas e resumo.', error)
      setTargets([])
      setSummary({
        total: 0,
        input: 0,
        output: 0,
      })
    }
  }

  useFocusEffect(
    useCallback(() => {
      void loadData()
    }, []),
  )

  const homeGoals = useMemo(() => {
    return (targets ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      current: formatCurrency(item.current),
      target: formatCurrency(item.amount),
      percentage: item.percentage,
    }))
  }, [targets])

  const homeSummary = useMemo(() => {
    return {
      total: formatCurrency(summary?.total ?? 0),
      input: {
        label: 'Entradas',
        value: formatCurrency(summary?.input ?? 0),
      },
      output: {
        label: 'Saídas',
        value: formatSignedCurrency(-(summary?.output ?? 0)),
      },
    }
  }, [summary])

  if (!targets || !summary) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <HomeHeader data={homeSummary} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Metas</Text>
          <Text style={styles.sectionSubtitle}>
            Organize seus objetivos e acompanhe o progresso.
          </Text>
        </View>

        {homeGoals.length > 0 ? (
          <View style={styles.list}>
            {homeGoals.map((item) => (
              <Pressable
                key={String(item.id)}
                onPress={() => router.navigate(`/in-progress/${item.id}`)}
                style={({ pressed }) => [
                  styles.goalCard,
                  pressed && styles.goalCardPressed,
                ]}
              >
                <View style={styles.goalTopRow}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalName}>{item.name}</Text>
                    <Text style={styles.goalPercent}>{item.percentage}% concluído</Text>
                  </View>

                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color={colors.gray[400]}
                  />
                </View>

                <Progress percentage={item.percentage} />

                <View style={styles.goalFooterRow}>
                  <View>
                    <Text style={styles.goalLabel}>Guardado</Text>
                    <Text style={styles.goalValue}>{item.current}</Text>
                  </View>

                  <View style={styles.goalFooterRight}>
                    <Text style={styles.goalLabel}>Meta</Text>
                    <Text style={styles.goalValue}>{item.target}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Nenhuma meta cadastrada</Text>
            <Text style={styles.emptyStateText}>
              Crie uma nova meta para começar a acompanhar seus objetivos.
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Button title="Nova meta" onPress={() => router.navigate('/target')} />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    marginTop: -14,
    backgroundColor: colors.gray[50],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  sectionHeader: {
    marginBottom: 18,
    gap: 4,
  },
  sectionTitle: {
    color: colors.black,
    fontSize: 22,
    fontFamily: fontFamily.bold,
  },
  sectionSubtitle: {
    color: colors.gray[500],
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fontFamily.regular,
  },
  list: {
    gap: 12,
  },
  emptyState: {
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
    gap: 6,
  },
  emptyStateTitle: {
    color: colors.black,
    fontSize: 16,
    fontFamily: fontFamily.bold,
  },
  emptyStateText: {
    color: colors.gray[500],
    fontSize: 13,
    lineHeight: 19,
    fontFamily: fontFamily.regular,
  },
  goalCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
    gap: 14,
  },
  goalCardPressed: {
    opacity: 0.92,
  },
  goalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  goalHeader: {
    flex: 1,
    gap: 4,
  },
  goalName: {
    color: colors.black,
    fontSize: 16,
    fontFamily: fontFamily.bold,
  },
  goalPercent: {
    color: colors.blue[500],
    fontSize: 13,
    fontFamily: fontFamily.medium,
  },
  goalFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  goalFooterRight: {
    alignItems: 'flex-end',
  },
  goalLabel: {
    color: colors.gray[500],
    fontSize: 11,
    fontFamily: fontFamily.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  goalValue: {
    marginTop: 5,
    color: colors.black,
    fontSize: 14,
    fontFamily: fontFamily.medium,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 24,
  },
})

import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { colors, fontFamily } from '@/theme'

type TargetItem = {
  id: string
  title: string
  current: number
  goal: number
}

const targets: TargetItem[] = [
  { id: '1', title: 'Apple Watch', current: 580, goal: 1790 },
  { id: '2', title: 'Cadeira ergonômica', current: 900, goal: 1200 },
  { id: '3', title: 'Viagem para o Rio', current: 1, goal: 3000 },
]

function getProgress(current: number, goal: number) {
  if (goal <= 0) return 0
  const percentage = (current / goal) * 100
  return Math.max(0, Math.min(100, percentage))
}

export default function Home() {
  const totalEntries = 6184.9
  const totalExits = 883.65
  const wallet = totalEntries - totalExits

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Total que você possui</Text>
        <Text style={styles.headerValue}>
          {wallet.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>

        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Entradas</Text>
            <Text style={styles.summaryPositive}>
              {totalEntries.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
          </View>

          <View>
            <Text style={styles.summaryLabel}>Saídas</Text>
            <Text style={styles.summaryNegative}>
              -{totalExits.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Metas</Text>

        {targets.map((target) => {
          const progress = getProgress(target.current, target.goal)

          return (
            <View key={target.id} style={styles.card}>
              <Text style={styles.cardTitle}>{target.title}</Text>
              <Text style={styles.cardSubtitle}>
                {progress.toFixed(0)}% • {target.current.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })} de {target.goal.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </Text>

              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>

              <View style={styles.actionsRow}>
                <Text style={styles.link} onPress={() => router.navigate(`/in-progress/${target.id}`)}>
                  Ver progresso
                </Text>

                <Text style={styles.link} onPress={() => router.navigate('/target')}>
                  Nova meta
                </Text>
              </View>
            </View>
          )
        })}

        <Text style={styles.primaryButton} onPress={() => router.navigate('/target')}>
          Nova meta
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
  header: {
    backgroundColor: colors.blue[500],
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
  },
  headerLabel: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
    fontFamily: fontFamily.regular,
    marginBottom: 8,
  },
  headerValue: {
    fontSize: 32,
    color: colors.white,
    fontFamily: fontFamily.bold,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.85,
    fontFamily: fontFamily.regular,
    marginBottom: 4,
  },
  summaryPositive: {
    fontSize: 16,
    color: '#A7F3D0',
    fontFamily: fontFamily.medium,
  },
  summaryNegative: {
    fontSize: 16,
    color: '#FECACA',
    fontFamily: fontFamily.medium,
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  card: {
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.gray[600],
    fontFamily: fontFamily.regular,
  },
  progressTrack: {
    width: '100%',
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  link: {
    fontSize: 14,
    color: colors.blue[500],
    fontFamily: fontFamily.medium,
  },
  primaryButton: {
    marginTop: 8,
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

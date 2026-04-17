import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button } from '@/components/Button'
import { HomeHeader } from '@/components/HomeHeader'
import { Progress } from '@/components/Progress'
import { colors, fontFamily } from '@/theme'

const summary = {
  total: 'R$ 2.680,00',
  input: { label: 'Entradas', value: 'R$ 6.184,90' },
  output: { label: 'Saidas', value: '-R$ 883,65' },
}

type TargetItem = {
  id: string
  name: string
  current: string
  target: string
  percentage: number
}

const targets: TargetItem[] = [
  {
    id: '1',
    name: 'Viagem para o Rio',
    current: 'R$ 580,00',
    target: 'R$ 1.780,00',
    percentage: 25,
  },
  {
    id: '2',
    name: 'Notebook',
    current: 'R$ 1.200,00',
    target: 'R$ 4.000,00',
    percentage: 30,
  },
]

export default function Index() {
  return (
    <View style={styles.container}>
      <HomeHeader data={summary} />

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

        <View style={styles.list}>
          {targets.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.navigate(`/in-progress/${item.id}`)}
              style={({ pressed }) => [
                styles.goalCard,
                pressed && styles.goalCardPressed,
              ]}
            >
              <View style={styles.goalTopRow}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalName}>{item.name}</Text>
                  <Text style={styles.goalPercent}>{item.percentage}% concluido</Text>
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

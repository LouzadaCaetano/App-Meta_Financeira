import { View } from 'react-native'
import { router } from 'expo-router'
import { HomeHeader } from '@/components/HomeHeader'
import { List } from '@/components/List'
import { Button } from '@/components/Button'

const summary = {
  total: 'R$ 2.680,00',
  input: { label: 'Entradas', value: 'R$ 6.184,90' },
  output: { label: 'Saídas', value: '-R$ 883,65' },
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
    name: 'Viagem',
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
    <View style={{ flex: 1 }}>
      <HomeHeader data={summary} />

      <View style={{ flex: 1, paddingTop: 24 }}>
        <List
          title="Metas"
          data={targets}
          renderItem={({ item }) => (
            <Button
              title={`${item.name} • ${item.percentage}%`}
              onPress={() => router.navigate(`/in-progress/${item.id}`)}
            />
          )}
          keyExtractor={(item) => item.id}
          emptyMessage="Nenhuma meta. Toque em nova meta para criar."
          containerStyle={{ paddingHorizontal: 24 }}
        />

        <View style={{ padding: 24, paddingBottom: 32 }}>
          <Button title="Nova meta" onPress={() => router.navigate('/target')} />
        </View>
      </View>
    </View>
  )
}

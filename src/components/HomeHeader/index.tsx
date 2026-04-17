import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'
import { Separator } from '@/components/Separator'
import { Summary, SummaryData } from '@/components/Summary'

export type HomeHeaderData = {
  total: string
  input: SummaryData
  output: SummaryData
}

type Props = {
  data: HomeHeaderData
}

export function HomeHeader({ data }: Props) {
  const insets = useSafeAreaInsets()

  return (
    <LinearGradient
      colors={[colors.blue[800], colors.blue[900]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingTop: insets.top + 20,
        paddingHorizontal: 24,
        paddingBottom: 34,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
      }}
    >
      <Text
        style={{
          color: 'rgba(255,255,255,0.78)',
          fontSize: 13,
          fontFamily: fontFamily.regular,
        }}
      >
        Total que você possui
      </Text>

      <Text
        style={{
          color: colors.white,
          fontSize: 36,
          fontFamily: fontFamily.bold,
          marginTop: 10,
          letterSpacing: -0.8,
        }}
      >
        {data.total}
      </Text>

      <View
        style={{
          height: 1,
          marginTop: 18,
          marginBottom: 18,
          backgroundColor: 'rgba(255,255,255,0.14)',
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Summary
          data={data.input}
          icon={{ name: 'arrow-upward', color: colors.green[400] }}
        />

        <Separator color="rgba(255,255,255,0.12)" height={34} />

        <Summary
          alignRight
          data={data.output}
          icon={{ name: 'arrow-downward', color: colors.red[400] }}
        />
      </View>
    </LinearGradient>
  )
}

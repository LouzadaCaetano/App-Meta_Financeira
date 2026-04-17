import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'
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
  return (
    <LinearGradient
      colors={[colors.blue[500], colors.blue[800]]}
      style={{ paddingTop: 56, paddingHorizontal: 24, paddingBottom: 24 }}
    >
      <Text
        style={{
          color: colors.white,
          fontSize: 14,
          fontFamily: fontFamily.regular,
        }}
      >
        Total que você possui
      </Text>

      <Text
        style={{
          color: colors.white,
          fontSize: 32,
          fontFamily: fontFamily.bold,
          marginTop: 10,
        }}
      >
        {data.total}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 18,
        }}
      >
        <Summary
          data={data.input}
          icon={{ name: 'arrow-upward', color: colors.green[500] }}
        />

        <Separator color={colors.blue[400]} />

        <Summary
          alignRight
          data={data.output}
          icon={{ name: 'arrow-downward', color: colors.red[400] }}
        />
      </View>
    </LinearGradient>
  )
}

import { Suspense } from 'react'
import { Stack } from 'expo-router'
import { SQLiteProvider } from 'expo-sqlite'
import { colors } from '@/theme/colors'
import { Loading } from '@/components/Loading'
import { migrate } from '@/database/migrate'
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter'

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  })

  if (!fontsLoaded) {
    return <Loading />
  }

  return (
    <Suspense fallback={<Loading />}>
      <SQLiteProvider databaseName="target.db" onInit={migrate} useSuspense>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.white },
          }}
        />
      </SQLiteProvider>
    </Suspense>
  )
}

import { MaterialIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/components/Button'
import { CurrencyInput } from '@/components/CurrencyInput'
import { Input } from '@/components/Input'
import { Loading } from '@/components/Loading'
import { TransactionType } from '@/components/TransactionType'
import { useTargetDatabase } from '@/database/useTargetDatabase'
import { useTransactionsDatabase } from '@/database/useTransactionsDatabase'
import { colors, fontFamily } from '@/theme'
import { TransactionTypes } from '@/utils/TransactionTypes'

export default function Transaction() {
  const params = useLocalSearchParams<{ id: string }>()
  const rawTargetId = Array.isArray(params.id) ? params.id[0] : params.id
  const targetId = rawTargetId ? Number(rawTargetId) : null
  const fallbackRoute = targetId ? `/in-progress/${targetId}` : '/'
  const targetDatabase = useTargetDatabase()
  const transactionsDatabase = useTransactionsDatabase()
  const [goalName, setGoalName] = useState<string | null>(null)
  const [type, setType] = useState(TransactionTypes.Input)
  const [value, setValue] = useState<number | null>(null)
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!Number.isInteger(targetId) || (targetId ?? 0) <= 0) {
      router.replace('/')
      return
    }

    let isMounted = true
    const currentTargetId = targetId as number

    async function loadTarget() {
      try {
        const target = await targetDatabase.show(currentTargetId)

        if (!isMounted) {
          return
        }

        if (!target) {
          router.replace('/')
          return
        }

        setGoalName(target.name)
      } catch (error) {
        console.warn('[Transaction] Falha ao carregar meta.', error)
        if (isMounted) {
          Alert.alert('Erro', 'Não foi possível carregar a meta.')
          router.replace('/')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadTarget()

    return () => {
      isMounted = false
    }
  }, [targetId])

  function handleBack() {
    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace(fallbackRoute)
  }

  async function handleSave() {
    if (isProcessing) {
      return
    }

    if (!targetId || !goalName) {
      router.replace('/')
      return
    }

    if (!value || value <= 0) {
      Alert.alert('Valor inválido', 'Informe um valor maior que zero para continuar.')
      return
    }

    const normalizedAmount = type === TransactionTypes.Output ? value * -1 : value

    try {
      setIsProcessing(true)
      await transactionsDatabase.create({
        target_id: targetId,
        amount: normalizedAmount,
        observation: reason,
      })
    } catch (error) {
      console.warn('[Transaction] Falha ao salvar transação.', error)
      Alert.alert('Erro', 'Não foi possível salvar a transação. Tente novamente.')
      setIsProcessing(false)
      return
    }

    setIsProcessing(false)

    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace(fallbackRoute)
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topBar}>
            <Pressable
              onPress={handleBack}
              hitSlop={8}
              style={({ pressed }) => [styles.topAction, pressed && styles.topActionPressed]}
            >
              <MaterialIcons name="arrow-back-ios-new" size={18} color={colors.black} />
              <Text style={styles.topActionLabel}>Voltar</Text>
            </Pressable>

            <View style={styles.topBarSpacer} />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Nova transação</Text>
            <Text style={styles.subtitle}>
              {goalName
                ? `Escolha se você vai guardar ou resgatar um valor para a meta ${goalName}.`
                : 'Escolha como registrar a movimentação da sua meta.'}
            </Text>
          </View>

          <View style={styles.form}>
            <TransactionType selected={type} onChange={setType} />

            <CurrencyInput label="Valor (R$)" value={value} onChangeValue={setValue} />

            <Input
              label="Motivo (opcional)"
              placeholder="Ex.: Aporte do mês"
              value={reason}
              onChangeText={setReason}
              editable={!isProcessing}
            />
          </View>

          <View style={styles.footer}>
            <Button title="Salvar" onPress={() => void handleSave()} isLoading={isProcessing} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
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
  topActionPressed: {
    opacity: 0.7,
  },
  topActionLabel: {
    color: colors.black,
    fontSize: 15,
    fontFamily: fontFamily.medium,
  },
  topBarSpacer: {
    width: 56,
  },
  header: {
    marginTop: 28,
    gap: 8,
  },
  title: {
    color: colors.black,
    fontSize: 34,
    fontFamily: fontFamily.bold,
    letterSpacing: -0.8,
  },
  subtitle: {
    maxWidth: 325,
    color: colors.gray[500],
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fontFamily.regular,
  },
  form: {
    marginTop: 28,
    gap: 18,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 28,
  },
})

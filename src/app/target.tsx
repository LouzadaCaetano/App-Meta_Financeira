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
import { useTargetDatabase } from '@/database/useTargetDatabase'
import { colors, fontFamily } from '@/theme'

export default function Target() {
  const params = useLocalSearchParams<{ id?: string }>()
  const rawTargetId = Array.isArray(params.id) ? params.id[0] : params.id
  const targetId = rawTargetId ? Number(rawTargetId) : null
  const isEditing = Number.isInteger(targetId) && (targetId ?? 0) > 0
  const targetDatabase = useTargetDatabase()
  const [name, setName] = useState('')
  const [targetValue, setTargetValue] = useState<number | null>(0)
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (rawTargetId && !isEditing) {
      router.replace('/')
      return
    }

    if (!isEditing || !targetId) {
      setName('')
      setTargetValue(0)
      setIsLoading(false)
      return
    }

    let isMounted = true
    const currentTargetId = targetId

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

        setName(target.name)
        setTargetValue(target.amount)
      } catch (error) {
        console.warn('[Target] Falha ao carregar meta para edição.', error)
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
  }, [isEditing, rawTargetId, targetId])

  function handleBack() {
    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace('/')
  }

  async function handleSave() {
    if (isProcessing) {
      return
    }

    const trimmedName = name.trim()

    if (!trimmedName) {
      Alert.alert('Nome obrigatório', 'Informe um nome para a meta.')
      return
    }

    if (!targetValue || targetValue <= 0) {
      Alert.alert('Valor inválido', 'Informe um valor-alvo maior que zero.')
      return
    }

    try {
      setIsProcessing(true)

      if (isEditing && targetId) {
        await targetDatabase.update({
          id: targetId,
          name: trimmedName,
          amount: targetValue,
        })
      } else {
        await targetDatabase.create({
          name: trimmedName,
          amount: targetValue,
        })
      }

      router.replace('/')
    } catch (error) {
      console.warn('[Target] Falha ao salvar meta.', error)
      Alert.alert('Erro', 'Não foi possível salvar a meta. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  function handleDeletePreview() {
    if (!targetId || isProcessing) {
      return
    }

    Alert.alert('Excluir meta', 'Deseja remover esta meta e todas as transações dela?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsProcessing(true)
            await targetDatabase.remove(targetId)
            router.replace('/')
          } catch (error) {
            console.warn('[Target] Falha ao excluir meta.', error)
            Alert.alert('Erro', 'Não foi possível excluir a meta.')
          } finally {
            setIsProcessing(false)
          }
        },
      },
    ])
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

            {isEditing ? (
              <Pressable
                onPress={handleDeletePreview}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.secondaryAction,
                  pressed && styles.topActionPressed,
                ]}
              >
                <Text style={styles.deleteActionLabel}>Excluir</Text>
              </Pressable>
            ) : (
              <View style={styles.topBarSpacer} />
            )}
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>{isEditing ? 'Editar meta' : 'Nova meta'}</Text>
            <Text style={styles.subtitle}>
              Defina um objetivo financeiro e acompanhe o valor guardado com clareza.
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Nome da meta"
              placeholder="Ex.: Viagem, notebook, reserva"
              value={name}
              onChangeText={setName}
              editable={!isProcessing}
            />

            <CurrencyInput
              label="Valor-alvo (R$)"
              value={targetValue}
              onChangeValue={setTargetValue}
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
  secondaryAction: {
    minWidth: 56,
    alignItems: 'flex-end',
  },
  topBarSpacer: {
    width: 56,
  },
  deleteActionLabel: {
    color: colors.red[500],
    fontSize: 14,
    fontFamily: fontFamily.medium,
  },
  header: {
    marginTop: 28,
    gap: 8,
  },
  title: {
    fontSize: 34,
    color: colors.black,
    fontFamily: fontFamily.bold,
    letterSpacing: -0.8,
  },
  subtitle: {
    maxWidth: 320,
    fontSize: 14,
    lineHeight: 21,
    color: colors.gray[500],
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

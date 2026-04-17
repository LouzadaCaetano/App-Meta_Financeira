import { MaterialIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
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
import { useGoals } from '@/context/goals-context'
import { colors, fontFamily } from '@/theme'

export default function Target() {
  const params = useLocalSearchParams<{ id?: string }>()
  const targetId = Array.isArray(params.id) ? params.id[0] : params.id
  const isEditing = !!targetId
  const { createGoal, deleteGoal, getGoalById, updateGoal } = useGoals()
  const goal = targetId ? getGoalById(targetId) : undefined

  const previewData = useMemo(() => {
    if (goal) {
      return goal
    }

    return { name: '', targetValue: 0 }
  }, [goal])

  const [name, setName] = useState(previewData.name)
  const [targetValue, setTargetValue] = useState<number | null>(previewData.targetValue)

  useEffect(() => {
    setName(previewData.name)
    setTargetValue(previewData.targetValue)
  }, [previewData])

  useEffect(() => {
    if (isEditing && !goal) {
      router.replace('/')
    }
  }, [goal, isEditing])

  function handleBack() {
    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace('/')
  }

  function handleSave() {
    const trimmedName = name.trim()

    if (!trimmedName) {
      Alert.alert('Nome obrigatório', 'Informe um nome para a meta.')
      return
    }

    if (!targetValue || targetValue <= 0) {
      Alert.alert('Valor inválido', 'Informe um valor-alvo maior que zero.')
      return
    }

    if (targetId) {
      updateGoal(targetId, { name: trimmedName, targetValue })
    } else {
      createGoal({ name: trimmedName, targetValue })
    }

    router.replace('/')
  }

  function handleDeletePreview() {
    if (!targetId) {
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
        onPress: () => {
          deleteGoal(targetId)
          router.replace('/')
        },
      },
    ])
  }

  if (isEditing && !goal) {
    return null
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
            />

            <CurrencyInput
              label="Valor-alvo (R$)"
              value={targetValue}
              onChangeValue={setTargetValue}
            />
          </View>

          <View style={styles.footer}>
            <Button title="Salvar" onPress={handleSave} />
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

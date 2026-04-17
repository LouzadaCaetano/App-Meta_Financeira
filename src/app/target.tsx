import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, fontFamily } from '@/theme'
import { Button } from '@/components/Button'
import { CurrencyInput } from '@/components/CurrencyInput'
import { Input } from '@/components/Input'

export default function Target() {
  const [name, setName] = useState('')
  const [targetValue, setTargetValue] = useState<number | null>(0)

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>Voltar</Text>
        </Pressable>

        <Text style={styles.title}>Nova meta</Text>
        <Text style={styles.subtitle}>
          Economize para alcançar sua meta financeira.
        </Text>

        <View style={styles.form}>
          <Input
            label="Nome da meta"
            placeholder="Ex: Viagem para praia, Apple Watch"
            value={name}
            onChangeText={setName}
          />

          <CurrencyInput
            label="Valor alvo (R$)"
            value={targetValue}
            onChangeValue={setTargetValue}
          />
        </View>

        <View style={styles.footer}>
          <Button title="Salvar" onPress={() => router.replace('/')} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 18,
  },
  back: {
    color: colors.black,
    fontSize: 16,
    fontFamily: fontFamily.medium,
  },
  title: {
    fontSize: 28,
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[600],
    fontFamily: fontFamily.regular,
  },
  form: {
    marginTop: 8,
    gap: 20,
  },
  footer: {
    marginTop: 'auto',
  },
})

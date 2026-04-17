import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, fontFamily } from '@/theme'
import { TransactionTypes } from '@/utils/TransactionTypes'
import { TransactionType } from '@/components/TransactionType'
import { CurrencyInput } from '@/components/CurrencyInput'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'

export default function Transaction() {
  const params = useLocalSearchParams<{ id: string }>()
  const targetId = Array.isArray(params.id) ? params.id[0] : params.id ?? ''
  const [type, setType] = useState(TransactionTypes.Input)
  const [value, setValue] = useState<number | null>(0)
  const [reason, setReason] = useState('')

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, padding: 24, gap: 24 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable onPress={() => router.back()}>
          <Text
            style={{
              color: colors.black,
              fontSize: 16,
              fontFamily: fontFamily.medium,
            }}
          >
            Voltar
          </Text>
        </Pressable>

        <View style={{ gap: 4 }}>
          <Text
            style={{
              color: colors.black,
              fontSize: 28,
              fontFamily: fontFamily.bold,
            }}
          >
            Nova transação
          </Text>
          <Text
            style={{
              color: colors.gray[600],
              fontSize: 14,
              fontFamily: fontFamily.regular,
            }}
          >
            Meta vinculada: {targetId}
          </Text>
        </View>

        <TransactionType selected={type} onChange={setType} />

        <CurrencyInput
          label="Valor (R$)"
          value={value}
          onChangeValue={setValue}
        />

        <Input
          label="Motivo"
          placeholder="Ex: Investir em CDB"
          value={reason}
          onChangeText={setReason}
        />

        <View style={{ marginTop: 'auto' }}>
          <Button
            title={`Salvar na meta ${targetId}`}
            onPress={() => router.replace(`/in-progress/${targetId}`)}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

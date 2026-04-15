import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { colors, fontFamily } from '@/theme'

export default function Transaction() {
  const params = useLocalSearchParams<{ id: string }>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.back} onPress={() => router.back()}>
          Voltar
        </Text>

        <Text style={styles.title}>Nova transação</Text>
        <Text style={styles.subtitle}>
          Meta vinculada: {params.id}
        </Text>

        <View style={styles.typeRow}>
          <Text style={[styles.typeButton, styles.typeButtonActive]}>Guardar</Text>
          <Text style={styles.typeButton}>Resgatar</Text>
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Valor (R$)</Text>
            <TextInput
              placeholder="50,00"
              placeholderTextColor={colors.gray[400]}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.label}>Motivo (opcional)</Text>
            <TextInput
              placeholder="Ex: Investi em um CDB"
              placeholderTextColor={colors.gray[400]}
              style={styles.input}
            />
          </View>

          <Text style={styles.button} onPress={() => router.back()}>
            Salvar
          </Text>
        </View>
      </View>
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
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
    color: colors.gray[700],
    fontFamily: fontFamily.medium,
  },
  typeButtonActive: {
    backgroundColor: colors.blue[500],
    color: colors.white,
  },
  form: {
    gap: 20,
  },
  label: {
    fontSize: 13,
    color: colors.gray[600],
    fontFamily: fontFamily.medium,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[300],
    paddingVertical: 10,
    fontSize: 16,
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.blue[500],
    color: colors.white,
    textAlign: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    overflow: 'hidden',
    fontFamily: fontFamily.bold,
    fontSize: 15,
  },
})

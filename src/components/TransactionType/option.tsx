import { MaterialIcons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'

type Props = {
  title: string
  icon: keyof typeof MaterialIcons.glyphMap
  isSelected: boolean
  onPress: () => void
}

export function Option({ title, icon, isSelected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isSelected ? colors.blue[500] : colors.gray[400],
        backgroundColor: isSelected ? colors.blue[500] : colors.white,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <MaterialIcons
          name={icon}
          size={18}
          color={isSelected ? colors.white : colors.gray[500]}
        />
        <Text
          style={{
            fontFamily: fontFamily.medium,
            color: isSelected ? colors.white : colors.gray[500],
          }}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  )
}

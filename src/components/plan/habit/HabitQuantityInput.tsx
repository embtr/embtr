import { Text, TextInput, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    value: number;
    setValue: Function;
}

export const HabitQuantityInput = ({ value, setValue }: Props) => {
    const { colors } = useTheme();

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <Text style={{ color: colors.text, flex: 1 }}>How Many?</Text>
            <TextInput
                onChangeText={(text) => {
                    setValue(text);
                }}
                value={value.toString()}
                keyboardType="numeric"
                placeholder="0"
                style={{
                    color: colors.text,
                    height: 50,
                    width: 90,
                    alignContent: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    backgroundColor: colors.text_input_background,
                    borderColor: colors.text_input_border,
                    borderWidth: 1,
                    textAlign: 'center', // Center the text horizontally
                }}
            />
        </View>
    );
};

import { View, Text, Pressable } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    elements: string[];
    defaultElement: string;
    showPickerModal: Function;
}
export const PickerElement = ({ elements, defaultElement, showPickerModal }: Props) => {
    const { colors } = useTheme();

    return (
        <View>
            <Pressable
                onPress={() => {
                    showPickerModal();
                }}
            >
                <Text style={{ color: colors.text }}>{defaultElement}</Text>
            </Pressable>
        </View>
    );
};

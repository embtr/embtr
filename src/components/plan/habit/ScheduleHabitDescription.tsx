import { useTheme } from 'src/components/theme/ThemeProvider';
import { View, Text, TextInput } from 'react-native';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';

interface Props {
    text: string;
    onChangeText: (text: string) => void;
    onPress: () => void;
}
export const ScheduleHabitDescription = ({ text, onChangeText, onPress }: Props) => {
    const { colors } = useTheme();
    return (
        <View
            style={{
                paddingTop: TIMELINE_CARD_PADDING * 2,
            }}
        >
            <Text
                onPress={onPress}
                style={{
                    color: colors.text,
                    fontFamily: POPPINS_MEDIUM,
                    fontSize: 16,
                }}
            >
                Description
            </Text>

            <View style={{ paddingTop: TIMELINE_CARD_PADDING / 4 }}>
                <TextInput
                    textAlignVertical="top"
                    style={{
                        height: 150,
                        borderRadius: 12,
                        padding: TIMELINE_CARD_PADDING,
                        backgroundColor: colors.text_input_background,
                        borderColor: colors.text_input_border,
                        borderWidth: 1,
                        color: colors.text,
                        fontFamily: POPPINS_REGULAR,
                    }}
                    multiline={true}
                    placeholder={'Enter some specifics about this habit.'}
                    placeholderTextColor={colors.secondary_text}
                    onChangeText={onChangeText}
                    value={text}
                />
            </View>
        </View>
    );
};

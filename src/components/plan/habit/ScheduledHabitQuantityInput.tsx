import { Keyboard, Text, TextInput, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UI } from 'src/util/constants';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';

export const ScheduledHabitQuantityInput = () => {
    const { colors } = useTheme();

    const { quantity, setQuantity } = useCreateEditScheduleHabit();

    const handleTextChange = (text: string) => {
        if (text.length > 0 && isNaN(parseInt(text))) {
            return;
        }

        setQuantity(text.length === 0 ? null : parseInt(text));
    };

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <Text style={{ color: colors.text, flex: 1 }}>How Many?</Text>

            <TextInput
                onChangeText={handleTextChange}
                value={quantity?.toString()}
                keyboardType="numeric"
                placeholderTextColor={colors.secondary_text}
                style={{
                    color: colors.text,
                    height: 50,
                    width: UI.SCHEDULE_HABIT.DETAILS.DETAIL_WIDTH,
                    borderRadius: 12,
                    backgroundColor: colors.text_input_background,
                    borderColor: colors.text_input_border,
                    borderWidth: 1,
                    textAlign: 'center', // Center the text horizontally
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                }}
            />
        </View>
    );
};

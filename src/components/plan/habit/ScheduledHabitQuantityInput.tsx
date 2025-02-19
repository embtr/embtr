import { Keyboard, Text, TextInput, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UI } from 'src/util/constants';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';

export const ScheduledHabitQuantityInput = () => {
    const { colors } = useTheme();

    const { quantity, setQuantity } = useCreateEditScheduleHabit();

    const handleTextChange = (text: string) => {
        if (text.length > 0 && isNaN(parseInt(text))) {
            setQuantity(quantity ?? 0 + 1);
            return;
        }

        if (text.length > 0 && parseInt(text) <= 0) {
            setQuantity(quantity ?? 0 + 1);
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
                    backgroundColor: colors.background_light,

                    textAlign: 'center', // Center the text horizontally
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                }}
            />
        </View>
    );
};

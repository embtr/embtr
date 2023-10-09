import { Text, TextInput, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UI } from 'src/util/constants';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';

export const ScheduledHabitQuantityInput = () => {
    const { colors } = useTheme();

    const { quantity, setQuantity } = useCreateEditScheduleHabit();

    const handleTextChange = (text: string) => {
        // remove all non numberic characters and only allow the first decimal point
        let numericValue = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        const asNumber = parseFloat(numericValue);

        setQuantity(asNumber);
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
                value={quantity.toString()}
                keyboardType="numeric"
                placeholder="0"
                style={{
                    color: colors.text,
                    height: 50,
                    width: UI.SCHEDULE_HABIT.DETAILS.DETAIL_WIDTH,
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

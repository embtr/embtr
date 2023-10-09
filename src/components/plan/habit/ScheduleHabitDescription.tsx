import { useTheme } from 'src/components/theme/ThemeProvider';
import { View, Text, TextInput } from 'react-native';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';

interface Props {}
export const ScheduleHabitDescription = ({}: Props) => {
    const { colors } = useTheme();
    const { description, setDescription } = useCreateEditScheduleHabit();

    return (
        <View
            style={{
                paddingTop: TIMELINE_CARD_PADDING * 2,
            }}
        >
            <Text
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
                    onChangeText={setDescription}
                    value={description}
                />
            </View>
        </View>
    );
};

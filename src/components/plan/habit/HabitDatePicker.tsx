import { View, Text, Pressable } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getVerticalAlignmentLine } from 'src/util/GeneralUtility';
import { UI, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    dateType: string;
    prettyDate: string;
    onPress: () => void;
}

export const HabitDatePicker = ({ dateType, prettyDate, onPress }: Props) => {
    const { colors } = useTheme();

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
            }}
        >
            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        color: colors.text,
                        fontFamily: POPPINS_MEDIUM,
                        fontSize: 16,
                    }}
                >
                    {dateType}
                </Text>
            </View>

            <View>
                <Pressable
                    onPress={() => {
                        onPress();
                    }}
                    style={{
                        height: 50,
                        width:
                            UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.DATE_WIDTH,
                        alignContent: 'center',
                        justifyContent: 'center',
                        borderRadius: 12,
                        backgroundColor: colors.text_input_background,
                        borderColor: colors.text_input_border,
                        borderWidth: 1,
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            color: colors.text,
                            fontFamily: POPPINS_REGULAR,
                        }}
                    >
                        {prettyDate}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

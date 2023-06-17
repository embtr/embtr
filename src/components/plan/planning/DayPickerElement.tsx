import { Dimensions } from 'react-native';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { getDayKey, getTodayKey } from 'src/controller/planning/PlannedDayController';

interface Props {
    item: any;
    index: number;
    isSelected: boolean;
}

export const DayPickerElement = ({ item, index, isSelected }: Props) => {
    const { colors } = useTheme();

    const itemWidth = Dimensions.get('window').width / 9.5;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const currentDate = new Date();
    let dateElements = Array.from(
        Array(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() + 1
        ).keys()
    );
    dateElements.shift();

    return (
        <View style={{ alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>
                <Ionicons
                    name={'sunny'}
                    size={10}
                    color={
                        getDayKey(index + 1) === getTodayKey()
                            ? isSelected
                                ? colors.today_calendar_picker_selected
                                : colors.today_calendar_picker_unselected
                            : undefined
                    }
                />
            </View>

            <Text
                style={{
                    textAlign: 'center',
                    fontSize: 14,
                    fontFamily: 'Poppins_400Regular',
                    color: isSelected
                        ? colors.today_calendar_picker_selected
                        : colors.today_calendar_picker_unselected,
                }}
            >
                {
                    days[
                        new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            index % 7
                        ).getDay()
                    ]
                }
            </Text>
            <Text
                style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontFamily: 'Poppins_600SemiBold',
                    color: isSelected
                        ? colors.today_calendar_picker_selected
                        : colors.today_calendar_picker_unselected,
                }}
            >
                {item}
            </Text>
            <View
                style={{
                    marginTop: 2,
                    width: '75%',
                    height: 2,
                    backgroundColor: isSelected ? colors.today_calendar_picker_selected : undefined,
                }}
            />
        </View>
    );
};

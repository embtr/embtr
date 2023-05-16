import React from 'react';
import { Dimensions } from 'react-native';
import { View, Text } from 'react-native';
import HorizontalPicker from '@vseslav/react-native-horizontal-picker';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { getDayKey, getTodayKey } from 'src/controller/planning/PlannedDayController';

interface Props {
    day: number;
    onDayChanged: Function;
}

export const DayPicker = ({ day, onDayChanged }: Props) => {
    const { colors } = useTheme();

    const itemWidth = Dimensions.get('window').width / 7;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const currentDate = new Date();
    let dateElements = Array.from(
        Array(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() + 1
        ).keys()
    );
    dateElements.shift();

    const [selected, setSelected] = React.useState<number>(day - 1);

    const onSelectionChange = (day: number) => {
        setSelected(day);
        onDayChanged(day + 1);
    };

    const renderItem = (item: any, index: any) => (
        <View style={{ width: itemWidth, alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>
                <Ionicons
                    name={'sunny'}
                    size={10}
                    color={
                        getDayKey(index + 1) === getTodayKey()
                            ? selected === index
                                ? colors.today_calendar_picker_selected
                                : colors.today_calendar_picker_unselected
                            : colors.background
                    }
                />
            </View>

            <Text
                style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontFamily: 'Poppins_400Regular',
                    color:
                        selected === index
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
                    fontSize: 18,
                    fontFamily: 'Poppins_600SemiBold',
                    color:
                        selected === index
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
                    backgroundColor:
                        selected === index
                            ? colors.today_calendar_picker_selected
                            : colors.background,
                }}
            />
        </View>
    );

    return (
        <View>
            <HorizontalPicker
                animatedScrollToDefaultIndex={true}
                defaultIndex={day - 1}
                snapTimeout={1000}
                data={dateElements}
                renderItem={renderItem}
                itemWidth={itemWidth}
                onChange={onSelectionChange}
            />
        </View>
    );
};

import React from 'react';
import { Dimensions } from 'react-native';
import { View, Text } from 'react-native';
import HorizontalPicker from '@vseslav/react-native-horizontal-picker';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    day: number,
    onDayChanged: Function
}

export const TodayPicker = ({ day, onDayChanged }: Props) => {
    const { colors } = useTheme();

    const itemWidth = (Dimensions.get('window').width / 7);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const Items = Array.from(Array(31).keys());
    const [selected, setSelected] = React.useState<number>(day);

    const onSelectionChange = (day: number) => {
        setSelected(day);
        onDayChanged(day);
    }

    const renderItem = (item: any, index: any) => (
        <View style={{ width: itemWidth, alignItems: "center" }}>
            <Text style={{ textAlign: "center", fontSize: 16, fontFamily: "Poppins_400Regular", color: selected === index ? colors.today_calendar_picker_selected : colors.today_calendar_picker_unselected }}>
                {days[index % 7]}
            </Text>
            <Text style={{ textAlign: "center", fontSize: 18, fontFamily: "Poppins_600SemiBold", color: selected === index ? colors.today_calendar_picker_selected : colors.today_calendar_picker_unselected }}>
                {item}
            </Text>
            <View style={{ marginTop: 4, width: "75%", height: 2, backgroundColor: selected === index ? colors.today_calendar_picker_selected : colors.background }} />
        </View>
    );

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_400Regular
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <View>
            <HorizontalPicker defaultIndex={day} snapTimeout={1000} data={Items} renderItem={renderItem} itemWidth={itemWidth} onChange={onSelectionChange} />
        </View>
    );
};
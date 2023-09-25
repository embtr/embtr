import React from 'react';
import { View } from 'react-native';
import { DayOfTheWeekToggle } from './DayOfTheWeekToggle';
import { DayOfTheWeek } from 'src/util/constants';

interface Props {
    onDaysChanged: Function;
}

export const DaysOfTheWeekToggle = ({ onDaysChanged }: Props) => {
    const [monday, setMonday] = React.useState<boolean>(false);
    const [tuesday, setTuesday] = React.useState<boolean>(false);
    const [wednesday, setWednesday] = React.useState<boolean>(false);
    const [thursday, setThursday] = React.useState<boolean>(false);
    const [friday, setFriday] = React.useState<boolean>(false);
    const [saturday, setSaturday] = React.useState<boolean>(false);
    const [sunday, setSunday] = React.useState<boolean>(false);

    React.useEffect(() => {
        const daysOfWeek: DayOfTheWeek[] = [];
        if (monday) {
            daysOfWeek.push(DayOfTheWeek.MONDAY);
        }
        if (tuesday) {
            daysOfWeek.push(DayOfTheWeek.TUESDAY);
        }
        if (wednesday) {
            daysOfWeek.push(DayOfTheWeek.WEDNESDAY);
        }
        if (thursday) {
            daysOfWeek.push(DayOfTheWeek.THURSDAY);
        }
        if (friday) {
            daysOfWeek.push(DayOfTheWeek.FRIDAY);
        }
        if (saturday) {
            daysOfWeek.push(DayOfTheWeek.SATURDAY);
        }
        if (sunday) {
            daysOfWeek.push(DayOfTheWeek.SUNDAY);
        }

        onDaysChanged(daysOfWeek);
    }, [monday, tuesday, wednesday, thursday, friday, saturday, sunday]);

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                <DayOfTheWeekToggle dayOfTheWeek={'M'} value={monday} setValue={setMonday} />
            </View>

            <View style={{ flex: 1 }}>
                <DayOfTheWeekToggle dayOfTheWeek={'T'} value={tuesday} setValue={setTuesday} />
            </View>

            <View style={{ flex: 1 }}>
                <DayOfTheWeekToggle dayOfTheWeek={'W'} value={wednesday} setValue={setWednesday} />
            </View>

            <View style={{ flex: 1 }}>
                <DayOfTheWeekToggle dayOfTheWeek={'T'} value={thursday} setValue={setThursday} />
            </View>

            <View style={{ flex: 1 }}>
                <DayOfTheWeekToggle dayOfTheWeek={'F'} value={friday} setValue={setFriday} />
            </View>

            <View style={{ flex: 1 }}>
                <DayOfTheWeekToggle dayOfTheWeek={'S'} value={saturday} setValue={setSaturday} />
            </View>

            <View style={{ flex: 1 }}>
                <DayOfTheWeekToggle dayOfTheWeek={'S'} value={sunday} setValue={setSunday} />
            </View>
        </View>
    );
};

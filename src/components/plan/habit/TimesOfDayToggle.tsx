import React from 'react';
import { View } from 'react-native';
import { TimeOfDayToggle } from './TimeOfDayToggle';
import { TimeOfDay } from 'resources/schema';
import { TimesOfDayCustomHooks } from 'src/controller/time_of_day/TimeOfDayController';

interface Props {
    onTimesChanged: Function;
}

export const TimesOfDayToggle = ({ onTimesChanged }: Props) => {
    const timesOfDay: TimeOfDay[] = TimesOfDayCustomHooks.useTimesOfDay();

    const [morning, setMorning] = React.useState<boolean>(false);
    const [afternoon, setAfternoon] = React.useState<boolean>(false);
    const [evening, setEvening] = React.useState<boolean>(false);
    const [night, setNight] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (timesOfDay?.length === 0) {
            return;
        }

        const toggledTimesOfDay: TimeOfDay[] = [];
        for (const timeOfDay of timesOfDay) {
            switch (timeOfDay.period) {
                case 'MORNING':
                    if (morning) {
                        toggledTimesOfDay.push(timeOfDay);
                    }
                    break;
                case 'AFTERNOON':
                    if (afternoon) {
                        toggledTimesOfDay.push(timeOfDay);
                    }
                    break;
                case 'EVENING':
                    if (evening) {
                        toggledTimesOfDay.push(timeOfDay);
                    }
                    break;
                case 'NIGHT':
                    if (night) {
                        toggledTimesOfDay.push(timeOfDay);
                    }
                    break;
            }
        }
        onTimesChanged(toggledTimesOfDay);
    }, [timesOfDay, morning, afternoon, evening, night]);

    return (
        <View style={{ flexDirection: 'row', width: '100%' }}>
            <TimeOfDayToggle timeOfDay={'Morning'} value={morning} setValue={setMorning} />
            <View style={{ flex: 1 }}></View>

            <TimeOfDayToggle timeOfDay={'Afternoon'} value={afternoon} setValue={setAfternoon} />
            <View style={{ flex: 1 }}></View>

            <TimeOfDayToggle timeOfDay={'Evening'} value={evening} setValue={setEvening} />
            <View style={{ flex: 1 }}></View>

            <TimeOfDayToggle timeOfDay={'Night'} value={night} setValue={setNight} />
        </View>
    );
};

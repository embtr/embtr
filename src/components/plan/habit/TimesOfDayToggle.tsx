import React from 'react';
import { View } from 'react-native';
import { TimeOfDayToggle } from './TimeOfDayToggle';
import { TimeOfDay } from 'src/util/constants';

interface Props {
    onTimesChanged: Function;
}

export const TimesOfDayToggle = ({ onTimesChanged }: Props) => {
    const [morning, setMorning] = React.useState<boolean>(false);
    const [afternoon, setAfternoon] = React.useState<boolean>(false);
    const [evening, setEvening] = React.useState<boolean>(false);
    const [night, setNight] = React.useState<boolean>(false);

    React.useEffect(() => {
        const timesOfDay: TimeOfDay[] = [];
        if (morning) {
            timesOfDay.push(TimeOfDay.MORNING);
        }
        if (afternoon) {
            timesOfDay.push(TimeOfDay.AFTERNOON);
        }
        if (evening) {
            timesOfDay.push(TimeOfDay.EVENING);
        }
        if (night) {
            timesOfDay.push(TimeOfDay.NIGHT);
        }

        onTimesChanged(timesOfDay);
    }, [morning, afternoon, evening, night]);

    return (
        <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={{ flex: 1 }}>
                <TimeOfDayToggle timeOfDay={'Morning'} value={morning} setValue={setMorning} />
            </View>

            <View style={{ flex: 1 }}>
                <TimeOfDayToggle
                    timeOfDay={'Afternoon'}
                    value={afternoon}
                    setValue={setAfternoon}
                />
            </View>

            <View style={{ flex: 1 }}>
                <TimeOfDayToggle timeOfDay={'Evening'} value={evening} setValue={setEvening} />
            </View>

            <View style={{ flex: 1 }}>
                <TimeOfDayToggle timeOfDay={'Night'} value={night} setValue={setNight} />
            </View>
        </View>
    );
};

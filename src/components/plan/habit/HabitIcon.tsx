import { View } from 'react-native';
import { Habit } from 'resources/schema';
import { SvgUri } from 'react-native-svg';

interface Props {
    habit: Habit;
    size: number;
    color: string;
}

export const HabitIcon = ({ habit, size, color }: Props) => {
    return (
        <View>
            <SvgUri width={size} height={size} uri={habit.iconUrl ?? ''} />
        </View>
    );
};

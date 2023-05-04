import { View } from 'react-native';
import { Habit } from 'resources/schema';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IoniconName, MaterialCommunityIconName } from 'src/util/constants';

interface Props {
    habit: Habit;
    size: number;
    color: string;
}

export const HabitIcon = ({ habit, size, color }: Props) => {
    return (
        <View>
            {habit.iconSource === 'ionicons' && (
                <Ionicons name={habit.iconName as IoniconName} size={size} color={color} />
            )}
            {habit.iconSource === 'material_community_icons' && (
                <MaterialCommunityIcons
                    name={habit.iconName as MaterialCommunityIconName}
                    size={size}
                    color={color}
                />
            )}
        </View>
    );
};

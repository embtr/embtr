import { format } from 'date-fns';
import { View, Text } from 'react-native';
import { GoalTaskCompleteIcon } from 'src/components/plan/goals/GoalTaskCompleteIcon';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    name: string;
    date: Date;
}

export const GoalTask = ({ name, date }: Props) => {
    const { colors } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.button_background,
                borderRadius: 15,
                width: '95%',
                height: 65,
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
            }}
        >
            <View style={{ paddingLeft: 10 }}>
                <GoalTaskCompleteIcon />
            </View>

            <View style={{ paddingLeft: 10 }}>
                <Text style={{ fontFamily: POPPINS_REGULAR, fontSize: 12, color: colors.goal_primary_font }}>{name}</Text>
                <Text style={{ opacity: 0.75, fontFamily: POPPINS_REGULAR, fontSize: 10, paddingLeft: 1, color: colors.goal_secondary_font }}>
                    {format(date, 'MMMM dd, yyyy')}
                </Text>
            </View>
        </View>
    );
};

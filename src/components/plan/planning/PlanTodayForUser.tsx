import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { PlanDay } from './PlanDay';
import { User } from 'resources/schema';
import { View, Text } from 'react-native';
import { PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    user: User;
}

export const PlanTodayForUser = ({ user }: Props) => {
    const { todayDayKey, plannedDay } = PlannedDayCustomHooks.useTodaysPlannedDayForUser(user);
    const { colors } = useTheme();

    if (plannedDay.isLoading) {
        return <View />;
    } else if (!plannedDay.data) {
        return (
            <View
                style={{
                    borderColor: '#404040',
                    backgroundColor: '#343434',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderRadius: 5,
                    paddingVertical: PADDING_LARGE,
                }}
            >
                <Text
                    style={{
                        color: colors.secondary_text,
                        fontFamily: POPPINS_REGULAR,
                        textAlign: 'center',
                    }}
                >
                    Things are quiet... too quiet...
                </Text>
            </View>
        );
    }

    return <PlanDay plannedDay={plannedDay.data} dayKey={todayDayKey} />;
};

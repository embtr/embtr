import { Text, View } from 'react-native';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { getDayOfWeekFromDayKey } from 'src/controller/planning/TaskController';
import { Countdown } from '../common/time/Countdown';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';

interface Props {
    plannedDay: PlannedDay;
}

export const TodaysCountdownWidget = ({ plannedDay }: Props) => {
    const { colors } = useTheme();

    const day = getDayOfWeekFromDayKey(plannedDay.id!);
    const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1);

    return (
        <WidgetBase>
            <View style={{ flex: 1, paddingLeft: 8 }}>
                <Text style={{ color: colors.text, fontFamily: 'Poppins_500Medium', fontSize: 16 }}>
                    Happy
                    <Text style={{ color: colors.tomorrow_selected_indicator }}> {dayCapitalized}</Text>!
                </Text>

                <View style={{ paddingTop: 5 }}>
                    <Text style={{ color: colors.text, fontSize: 12, fontFamily: 'Poppins_400Regular' }}>
                        <Countdown /> remaining
                    </Text>
                </View>
            </View>
        </WidgetBase>
    );
};

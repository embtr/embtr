import { Text, View } from 'react-native';
import { getLocalDayOfWeek } from 'src/controller/planning/TaskController';
import { Countdown } from '../common/time/Countdown';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { POPPINS_MEDIUM } from 'src/util/constants';

export const TodaysCountdownWidget = () => {
    const { colors } = useTheme();

    const date = new Date();
    const day = getLocalDayOfWeek(date);
    const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1);

    const dateString = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    });
    return (
        <WidgetBase>
            <View>
                <Text style={{ color: colors.text, fontFamily: POPPINS_MEDIUM, fontSize: 16 }}>
                    Happy
                    <Text style={{ color: colors.accent_color }}> {dayCapitalized}</Text>, {dateString}!
                </Text>

                <View style={{ paddingTop: 5 }}>
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 12,
                            fontFamily: 'Poppins_400Regular',
                        }}
                    >
                        <Countdown /> remaining
                    </Text>
                </View>
            </View>
        </WidgetBase>
    );
};

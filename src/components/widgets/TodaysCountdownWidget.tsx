import { Text, View } from 'react-native';
import { getLocalDayOfWeek } from 'src/controller/planning/TaskController';
import { Countdown } from '../common/time/Countdown';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';

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
                    <Text style={{ color: colors.accent_color }}> {dayCapitalized}</Text>{' '}
                    {dateString}!
                </Text>

                <View style={{ paddingTop: 5, flexDirection: 'row' }}>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontSize: 12,
                            fontFamily: POPPINS_REGULAR,
                            paddingTop: 2,
                            textAlign: 'left',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        no tasks for today
                    </Text>

                    <Countdown />
                </View>
            </View>
        </WidgetBase>
    );
};

import { Text, View } from 'react-native';
import { getDayOfWeek } from 'src/controller/planning/TaskController';
import { Countdown } from '../common/time/Countdown';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';

export const TodaysCountdownWidget = () => {
    const { colors } = useTheme();

    const date = new Date();
    const day = getDayOfWeek(date);
    const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1);

    return (
        <WidgetBase>
            <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: 'Poppins_500Medium', fontSize: 16 }}>
                    Happy
                    <Text style={{ color: colors.tomorrow_selected_indicator }}>
                        {' '}
                        {dayCapitalized}
                    </Text>
                    !
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

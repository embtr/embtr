import { Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';

export const QuoteOfTheDayWidget = () => {
    const { colors } = useTheme();

    return (
        <TouchableWithoutFeedback>
            <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                <View
                    style={[
                        {
                            borderRadius: 15,
                            backgroundColor: colors.timeline_card_background,
                            paddingTop: 10,
                            paddingBottom: 10,
                            paddingLeft: 10,
                            paddingRight: 10,
                        },
                        CARD_SHADOW,
                    ]}
                >
                    <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Quote Of The Day</Text>
                    <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR, paddingTop: 15, fontSize: 14 }}>Goals without dates are just dreams!</Text>
                    <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR, paddingTop: 15, fontSize: 11, textAlign: 'right' }}>
                        added by Brent Ryczak
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

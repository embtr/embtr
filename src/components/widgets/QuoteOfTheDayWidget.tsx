import { Text } from 'react-native';
import { POPPINS_REGULAR, POPPINS_REGULAR_ITALIC, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';

export const QuoteOfTheDayWidget = () => {
    const { colors } = useTheme();

    return (
        <WidgetBase>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Quote Of The Day</Text>
            <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR_ITALIC, paddingTop: 5, fontSize: 14 }}>Goals without dates are just dreams!</Text>
            <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR, paddingTop: 15, fontSize: 11, textAlign: 'right' }}>added by Brent Ryczak</Text>
        </WidgetBase>
    );
};

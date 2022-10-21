import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'react-native';
import { EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { POPPINS_REGULAR, POPPINS_REGULAR_ITALIC, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';

export const QuoteOfTheDayWidget = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<TodayTab, 'AddQuoteOfTheDay'>>();
    const closeMenu = useAppSelector(getCloseMenu);

    let menuOptions: EmbtrMenuOption[] = [];
    menuOptions.push({
        name: 'Add Quote',
        onPress: () => {
            navigation.navigate('AddQuoteOfTheDay');
            closeMenu();
        },
    });

    return (
        <WidgetBase menuOptions={menuOptions}>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Quote Of The Day</Text>
            <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR_ITALIC, paddingTop: 5, fontSize: 14 }}>Goals without dates are just dreams!</Text>
            <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR, paddingTop: 15, fontSize: 11, textAlign: 'right' }}>added by Brent Ryczak</Text>
        </WidgetBase>
    );
};

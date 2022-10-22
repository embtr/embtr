import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text } from 'react-native';
import { EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { useTheme } from 'src/components/theme/ThemeProvider';
import ProfileController from 'src/controller/profile/ProfileController';
import QuoteOfTheDayController, { QuoteOfTheDayModel } from 'src/controller/widgets/quote_of_the_day/QuoteOfTheDayController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { POPPINS_REGULAR, POPPINS_REGULAR_ITALIC, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';

interface Props {
    refreshedDate: Date;
}

export const QuoteOfTheDayWidget = ({ refreshedDate }: Props) => {
    const { colors } = useTheme();

    const [quoteOfTheDay, setQuoteOfTheDay] = React.useState<QuoteOfTheDayModel>();
    const [addedBy, setAddedBy] = React.useState<UserProfileModel>();

    const navigation = useNavigation<StackNavigationProp<TodayTab, 'AddQuoteOfTheDay'>>();
    const closeMenu = useAppSelector(getCloseMenu);

    React.useEffect(() => {
        fetch();
    }, [refreshedDate]);

    const fetch = async () => {
        const quote: QuoteOfTheDayModel = await QuoteOfTheDayController.getCurrentQuoteOfTheDay();
        if (quote.id !== quoteOfTheDay?.id) {
            setQuoteOfTheDay(quote);
            ProfileController.getProfile(quote.uid, setAddedBy);
        }
    };

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
            <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR_ITALIC, paddingTop: 5, paddingLeft: 10, paddingRight: 10, fontSize: 14 }}>
                {quoteOfTheDay?.quote}
            </Text>
            <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR, paddingTop: 5, paddingRight: 10, fontSize: 12, textAlign: 'right' }}>
                - {quoteOfTheDay?.author}
            </Text>
            <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR, paddingTop: 15, fontSize: 10, textAlign: 'right' }}>added by {addedBy?.name}</Text>
        </WidgetBase>
    );
};

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { POPPINS_REGULAR, POPPINS_REGULAR_ITALIC, POPPINS_SEMI_BOLD, WIDGET_LIKE_ICON_SIZE } from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import * as Haptics from 'expo-haptics';
import { QuoteOfTheDayModel } from 'src/model/OldModels';

interface Props {
    refreshedTimestamp: Date;
}

export const QuoteOfTheDayWidget = ({ refreshedTimestamp }: Props) => {
    const { colors } = useTheme();

    const [quoteOfTheDay, setQuoteOfTheDay] = React.useState<QuoteOfTheDayModel>();

    const navigation = useNavigation<StackNavigationProp<TodayTab, 'AddQuoteOfTheDay'>>();
    const closeMenu = useAppSelector(getCloseMenu);

    React.useEffect(() => {
        fetch();
    }, [refreshedTimestamp]);

    const fetch = async () => {};

    let menuOptions: EmbtrMenuOption[] = [];
    menuOptions.push({
        name: 'Add Quote',
        onPress: () => {
            navigation.navigate('AddQuoteOfTheDay');
            closeMenu();
        },
    });

    const isLiked = quoteOfTheDay?.likes.includes(getAuth().currentUser!.uid);

    const onLike = async () => {
        if (isLiked || !quoteOfTheDay) {
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    };

    const navigateToUserProfile = () => {
        if (!quoteOfTheDay) {
            return;
        }

        navigation.navigate('UserProfile', { id: quoteOfTheDay.uid });
    };

    return (
        <WidgetBase menuOptions={menuOptions}>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Quote Of The Day</Text>
            <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR_ITALIC, paddingTop: 5, paddingLeft: 10, paddingRight: 10, fontSize: 14 }}>
                {'"'}
                {quoteOfTheDay?.quote}
                {'"'}
            </Text>
            <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR, paddingTop: 5, paddingRight: 10, fontSize: 12, textAlign: 'right' }}>
                {quoteOfTheDay?.author ? '-' : ''} {quoteOfTheDay?.author}
            </Text>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableWithoutFeedback onPress={onLike}>
                            <Ionicons
                                name={isLiked ? 'heart' : 'heart-outline'}
                                size={WIDGET_LIKE_ICON_SIZE}
                                color={isLiked ? 'red' : colors.timeline_card_footer}
                            />
                        </TouchableWithoutFeedback>
                        <Text style={{ fontFamily: POPPINS_REGULAR, color: colors.text, paddingLeft: 3, paddingTop: 1 }}>{quoteOfTheDay?.likes.length}</Text>
                    </View>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text
                        style={{ color: colors.text, fontFamily: POPPINS_REGULAR, paddingTop: 15, fontSize: 10, textAlign: 'right' }}
                        onPress={navigateToUserProfile}
                    >
                        added by{' '}
                        <Text
                            style={{ color: colors.tab_selected, fontFamily: POPPINS_REGULAR, paddingTop: 15, fontSize: 10, textAlign: 'right' }}
                            onPress={navigateToUserProfile}
                        ></Text>
                    </Text>
                </View>
            </View>
        </WidgetBase>
    );
};

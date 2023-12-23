import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import {
    CARD_SHADOW,
    POPPINS_REGULAR,
    POPPINS_REGULAR_ITALIC,
    POPPINS_SEMI_BOLD,
    WIDGET_LIKE_ICON_SIZE,
} from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { QuoteOfTheDay } from 'resources/schema';
import { QuoteOfTheDayController } from 'src/controller/widget/quote_of_the_day/QuoteOfTheDayController';
import { LikeController } from 'src/controller/api/general/LikeController';
import { Interactable } from 'resources/types/interactable/Interactable';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
    refreshedTimestamp: Date;
}

export const QuoteOfTheDayWidget = ({ refreshedTimestamp }: Props) => {
    const { colors } = useTheme();

    const [quoteOfTheDay, setQuoteOfTheDay] = React.useState<QuoteOfTheDay>();
    const [isLiked, setIsLiked] = React.useState<boolean>(false);
    const [likeCount, setLikeCount] = React.useState<number>(0);

    const navigation = useNavigation<StackNavigationProp<TodayTab, 'AddQuoteOfTheDay'>>();
    const closeMenu = useAppSelector(getCloseMenu);

    React.useEffect(() => {
        fetch();
    }, [refreshedTimestamp]);

    React.useEffect(() => {
        fetchIsLiked();
    }, [quoteOfTheDay]);

    const fetch = async () => {
        const quoteOfTheDay = await QuoteOfTheDayController.get();
        if (quoteOfTheDay) {
            setQuoteOfTheDay(quoteOfTheDay);
            setLikeCount(quoteOfTheDay.likes?.length || 0);
        }
    };

    const fetchIsLiked = async () => {
        const currentUserId = await getUserIdFromToken();
        if (!currentUserId || !quoteOfTheDay?.id || !quoteOfTheDay?.likes) {
            return;
        }

        const isLiked = quoteOfTheDay?.likes?.some((like) => like?.userId === currentUserId);
        setIsLiked(isLiked);
        setLikeCount(likeCount + 1);
    };

    const onAdd = () => {
        navigation.navigate('AddQuoteOfTheDay');
        closeMenu();
    };

    const onLike = async () => {
        if (isLiked || !quoteOfTheDay?.id) {
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        LikeController.add(Interactable.QUOTE_OF_THE_DAY, quoteOfTheDay.id);
        setIsLiked(true);
    };

    const navigateToUserProfile = () => {
        if (!quoteOfTheDay?.user?.uid) {
            return;
        }

        navigation.navigate('UserProfile', { id: quoteOfTheDay.user.uid });
    };

    return (
        <WidgetBase>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                    Quote Of The Day
                </Text>

                <View style={{ flex: 1 }} />

                <TouchableOpacity
                    onPress={onAdd}
                    style={[
                        {
                            backgroundColor: '#404040',
                            borderRadius: 5,
                            paddingHorizontal: 4,
                            paddingVertical: 2,
                        },
                        CARD_SHADOW,
                    ]}
                >
                    <Ionicons name={'add-outline'} size={18} color={colors.secondary_text} />
                </TouchableOpacity>
            </View>
            <Text
                style={{
                    color: colors.text,
                    fontFamily: POPPINS_REGULAR_ITALIC,
                    paddingTop: 5,
                    paddingLeft: 10,
                    paddingRight: 10,
                    fontSize: 14,
                }}
            >
                {'"'}
                {quoteOfTheDay?.quote}
                {'"'}
            </Text>
            <Text
                style={{
                    color: colors.text,
                    fontFamily: POPPINS_REGULAR,
                    paddingTop: 5,
                    paddingRight: 10,
                    fontSize: 12,
                    textAlign: 'right',
                }}
            >
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
                        <Text
                            style={{
                                fontFamily: POPPINS_REGULAR,
                                color: colors.text,
                                paddingLeft: 3,
                                paddingTop: 1,
                            }}
                        >
                            {quoteOfTheDay?.likes?.length || 0}
                        </Text>
                    </View>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_REGULAR,
                            paddingTop: 15,
                            fontSize: 10,
                            textAlign: 'right',
                        }}
                        onPress={navigateToUserProfile}
                    >
                        added by{'  '}
                        <Text
                            style={{
                                color: colors.accent_color_light,
                                fontFamily: POPPINS_REGULAR,
                                paddingTop: 15,
                                fontSize: 10,
                                textAlign: 'right',
                            }}
                            onPress={navigateToUserProfile}
                        >
                            {quoteOfTheDay?.user?.displayName}
                        </Text>
                    </Text>
                </View>
            </View>
        </WidgetBase>
    );
};

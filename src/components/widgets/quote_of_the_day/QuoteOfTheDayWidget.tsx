import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
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
import { QuoteOfTheDayCustomHooks } from 'src/controller/widget/quote_of_the_day/QuoteOfTheDayController';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import { wait } from 'src/util/GeneralUtility';
import { QuoteOfTheDayInteractableElementCustomHooks } from 'src/components/timeline/interactable/QuoteOfTheDayInteractableElementCustomHooks';
import { QuoteOfTheDay } from 'resources/schema';
import { Screen } from 'src/components/common/Screen';

const QuoteOfTheDayPlaceholder = () => {
    return (
        <Screen>
            <View />
        </Screen>
    );
};

interface ImplementationProps {
    quoteOfTheDay: QuoteOfTheDay;
}

const QuoteOfTheDayImplementation = ({ quoteOfTheDay }: ImplementationProps) => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<TodayTab, 'AddQuoteOfTheDay'>>();
    const [isAnimating, setIsAnimating] = React.useState(false);

    const interactableData =
        QuoteOfTheDayInteractableElementCustomHooks.useQuoteOfTheDayInteractableElement(
            quoteOfTheDay
        );

    const closeMenu = useAppSelector(getCloseMenu);

    const animation = React.useRef<LottieView>(null);
    const onHeartPressed = () => {
        animation.current?.play();
        setIsAnimating(true);
        wait(1000).then(() => {
            animation.current?.reset();
            setIsAnimating(false);
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        interactableData.onLike();
    };

    const onAdd = () => {
        navigation.navigate('AddQuoteOfTheDay');
        closeMenu();
    };

    const navigateToUserProfile = () => {
        if (!quoteOfTheDay.user?.uid) {
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
                            backgroundColor: colors.background_light,
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
                {quoteOfTheDay.quote}
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
                {quoteOfTheDay.author ? '-' : ''} {quoteOfTheDay.author}
            </Text>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: -1,
                            width: 200,
                            height: 200,
                            left: -150,
                            top: -21,
                            transform: [{ scaleX: -1 }],
                        }}
                    >
                        <LottieView
                            autoPlay={false}
                            ref={animation}
                            style={{
                                width: 80,
                                height: 80,
                            }}
                            source={require('../../../../resources/lottie-heart.json')}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Pressable onPress={onHeartPressed}>
                            <View
                                style={{
                                    height: WIDGET_LIKE_ICON_SIZE,
                                    width: WIDGET_LIKE_ICON_SIZE,
                                }}
                            >
                                <Ionicons
                                    style={{ display: isAnimating ? 'none' : undefined }}
                                    name={interactableData.isLiked ? 'heart' : 'heart-outline'}
                                    size={WIDGET_LIKE_ICON_SIZE}
                                    color={
                                        interactableData.isLiked
                                            ? 'red'
                                            : colors.timeline_card_footer
                                    }
                                />
                            </View>
                        </Pressable>
                        <Text
                            style={{
                                fontFamily: POPPINS_REGULAR,
                                color: colors.text,
                                paddingLeft: 3,
                                paddingTop: 1,
                            }}
                        >
                            {interactableData.likeCount}
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
                            {quoteOfTheDay.user?.displayName}
                        </Text>
                    </Text>
                </View>
            </View>
        </WidgetBase>
    );
};

export const QuoteOfTheDayWidget = () => {
    const quoteOfTheDay = QuoteOfTheDayCustomHooks.useQuoteOfTheDay();

    if (!quoteOfTheDay.data) {
        return <QuoteOfTheDayPlaceholder />;
    }

    return <QuoteOfTheDayImplementation quoteOfTheDay={quoteOfTheDay.data} />;
};

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import {
    POPPINS_REGULAR,
    TIMELINE_CARD_ICON_COUNT_SIZE,
    TIMELINE_CARD_ICON_SIZE,
} from 'src/util/constants';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import { wait } from 'src/util/GeneralUtility';
import { isDesktopBrowser, isMobileBrowser } from 'src/util/DeviceUtil';

interface Props {
    likeCount: number;
    isLiked: boolean;
    onLike: Function;
    commentCount: number;
    padding?: number;
}

const PostDetailsActionBar = ({ likeCount, isLiked, commentCount, onLike, padding }: Props) => {
    const { colors } = useTheme();

    const [heartPressed, setHeartPressed] = React.useState(isLiked);
    const [isAnimating, setIsAnimating] = React.useState(false);

    const animation = React.useRef<LottieView>(null);

    React.useEffect(() => {
        setHeartPressed(isLiked);
    }, [isLiked]);

    const onHeartPressed = () => {
        if (!heartPressed) {
            if (!(isMobileBrowser() || isDesktopBrowser())) {
                animation.current?.play();
                setIsAnimating(true);
                wait(1000).then(() => {
                    animation.current?.reset();
                    setIsAnimating(false);
                });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onLike();
        }
    };

    return (
        <View style={{ padding: padding ?? undefined }}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ height: 0, width: 0, position: 'relative' }}>
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: -1,
                            width: 200,
                            height: 200,
                            left: -144,
                            top: -27,
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
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <Pressable onPress={heartPressed ? undefined : onHeartPressed}>
                        <View style={{ width: TIMELINE_CARD_ICON_SIZE }}>
                            <Ionicons
                                style={{ display: isAnimating ? 'none' : undefined }}
                                name={heartPressed ? 'heart' : 'heart-outline'}
                                size={TIMELINE_CARD_ICON_SIZE}
                                color={heartPressed ? 'red' : colors.timeline_card_footer}
                            />
                        </View>
                    </Pressable>

                    <View style={{ justifyContent: 'center', paddingLeft: 4 }}>
                        <Text
                            style={{
                                color: colors.timeline_card_footer,
                                fontSize: TIMELINE_CARD_ICON_COUNT_SIZE,
                                fontFamily: 'Poppins_500Medium',
                            }}
                        >
                            {likeCount}
                        </Text>
                    </View>

                    <View style={{ borderColor: colors.text, paddingLeft: 20 }}>
                        <Ionicons
                            name={'chatbox-outline'}
                            size={TIMELINE_CARD_ICON_SIZE}
                            color={colors.timeline_card_footer}
                        />
                    </View>

                    <View style={{ justifyContent: 'center', paddingLeft: 4 }}>
                        <Text
                            style={{
                                color: colors.timeline_card_footer,
                                fontSize: TIMELINE_CARD_ICON_COUNT_SIZE,
                                fontFamily: 'Poppins_500Medium',
                            }}
                        >
                            {commentCount}
                        </Text>
                    </View>
                </View>

                <View style={{ flex: 1 }} />
                <View style={{}}>
                    <Pressable
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            alert("I don't work yet :(");
                        }}
                    >
                        <Text
                            style={{
                                paddingRight: 12,
                                color: colors.text,
                                fontSize: 12,
                                fontFamily: POPPINS_REGULAR,
                            }}
                        >
                            Share
                        </Text>
                        <Ionicons
                            name={'share-outline'}
                            size={TIMELINE_CARD_ICON_SIZE}
                            color={colors.timeline_card_footer}
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default PostDetailsActionBar;

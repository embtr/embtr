import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import {
    TIMELINE_CARD_ICON_COUNT_SIZE,
    TIMELINE_CARD_ICON_SIZE,
    TIMELINE_CARD_PADDING,
} from 'src/util/constants';
import * as Haptics from 'expo-haptics';
import { timelineEntryWasLikedBy } from 'src/controller/timeline/story/StoryController';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import LottieView from 'lottie-react-native';
import { wait } from 'src/util/GeneralUtility';
import { Like } from 'resources/schema';
import { isDesktopBrowser, isMobileBrowser } from 'src/util/DeviceUtil';

interface Props {
    likes: Like[];
    commentCount: number;
    onLike: Function;
}

const PostDetailsActionBar = ({ likes, commentCount, onLike }: Props) => {
    const { colors } = useTheme();

    const isLiked = timelineEntryWasLikedBy(likes, getCurrentUid());
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

            <View style={{ flexDirection: 'row', flex: 1 }}>
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
                        {likes.length}
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

            <View style={{ flex: 1 }}>
                <Pressable
                    style={{ alignItems: 'flex-end', paddingRight: TIMELINE_CARD_PADDING }}
                    onPress={() => {
                        alert("I don't work yet :(");
                    }}
                >
                    <Ionicons
                        name={'share-outline'}
                        size={TIMELINE_CARD_ICON_SIZE}
                        color={colors.timeline_card_footer}
                    />
                </Pressable>
            </View>
        </View>
    );
};

export default PostDetailsActionBar;

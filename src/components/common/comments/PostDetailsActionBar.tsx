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
import { InteractableData } from 'src/components/timeline/InteractableElementCustomHooks';

interface Props {
    interactableData: InteractableData;
    padding?: number;
}

const PostDetailsActionBar = ({ interactableData, padding }: Props) => {
    const { colors } = useTheme();

    const [isAnimating, setIsAnimating] = React.useState(false);
    const animation = React.useRef<LottieView>(null);

    const onHeartPressed = () => {
        if (interactableData.isLiked) {
            return;
        }

        animation.current?.play();
        setIsAnimating(true);
        wait(1000).then(() => {
            animation.current?.reset();
            setIsAnimating(false);
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        interactableData.onLike();
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
                    <Pressable onPress={interactableData.isLiked ? undefined : onHeartPressed}>
                        <View style={{ width: TIMELINE_CARD_ICON_SIZE }}>
                            <Ionicons
                                style={{ display: isAnimating ? 'none' : undefined }}
                                name={interactableData.isLiked ? 'heart' : 'heart-outline'}
                                size={TIMELINE_CARD_ICON_SIZE}
                                color={
                                    interactableData.isLiked ? 'red' : colors.timeline_card_footer
                                }
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
                            {interactableData.likeCount}
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
                            {interactableData.commentCount}
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
                        ></Text>
                        <Ionicons
                            name={'share-outline'}
                            size={TIMELINE_CARD_ICON_SIZE}
                            color={colors.secondary_text}
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default PostDetailsActionBar;

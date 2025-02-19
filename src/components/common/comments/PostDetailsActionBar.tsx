import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
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
import { InteractableData } from 'src/components/timeline/interactable/InteractableElementCustomHooks';

const onMenuPressed = (interactableData: InteractableData) => {
    Alert.alert(
        'Advanced Options',
        '',
        [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            {
                text: 'Report Post',
                onPress: () => {
                    interactableData.report();
                    Alert.alert(
                        'Reported',
                        'The post has been reported. Thank you for your feedback.',
                        [
                            {
                                text: 'OK',
                                onPress: () => { },
                            },
                        ]
                    );
                },
                style: 'destructive',
            },
        ],
        { cancelable: true }
    );
};

const onHeartPressed = async (
    interactableData: InteractableData,
    setIsAnimating: Function,
    animation: React.RefObject<LottieView>
) => {
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

interface Props {
    interactableData: InteractableData;
    isCurrentUser: boolean;
    padding?: number;
}

const PostDetailsActionBar = ({ interactableData, padding, isCurrentUser }: Props) => {
    const { colors } = useTheme();

    const [isAnimating, setIsAnimating] = React.useState(false);
    const animation = React.useRef<LottieView>(null);

    const menu = isCurrentUser ? (
        <View />
    ) : (
        <Pressable
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onPress={() => onMenuPressed(interactableData)}
        >
            <Ionicons
                name={'ellipsis-horizontal-outline'}
                size={TIMELINE_CARD_ICON_SIZE / 1.5}
                color={colors.secondary_text}
            />
        </Pressable>
    );

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
                            left: -148,
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
                    <Pressable
                        onPress={
                            interactableData.isLiked
                                ? undefined
                                : () => onHeartPressed(interactableData, setIsAnimating, animation)
                        }
                    >
                        <View style={{ width: TIMELINE_CARD_ICON_SIZE }}>
                            <Ionicons
                                style={{ display: isAnimating ? 'none' : undefined }}
                                name={interactableData.isLiked ? 'heart' : 'heart-outline'}
                                size={TIMELINE_CARD_ICON_SIZE}
                                color={interactableData.isLiked ? 'red' : colors.text}
                            />
                        </View>
                    </Pressable>

                    <View style={{ justifyContent: 'center', paddingLeft: 4 }}>
                        <Text
                            style={{
                                color: colors.text,
                                fontSize: TIMELINE_CARD_ICON_COUNT_SIZE,
                                fontFamily: POPPINS_REGULAR,
                            }}
                        >
                            {interactableData.likeCount === 0
                                ? 'Be the first!'
                                : interactableData.likeCount}
                        </Text>
                    </View>

                    <View style={{ borderColor: colors.text, paddingLeft: 20 }}>
                        <Ionicons
                            name={'chatbox-outline'}
                            size={TIMELINE_CARD_ICON_SIZE}
                            color={colors.text}
                        />
                    </View>

                    <View style={{ justifyContent: 'center', paddingLeft: 4 }}>
                        <Text
                            style={{
                                color: colors.text,
                                fontSize: TIMELINE_CARD_ICON_COUNT_SIZE,
                                fontFamily: POPPINS_REGULAR,
                            }}
                        >
                            {interactableData.comments.length === 0
                                ? 'Be the first!'
                                : interactableData.comments.length}
                        </Text>
                    </View>
                </View>

                <View style={{ flex: 1 }} />
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>{menu}</View>
            </View>
        </View>
    );
};

export default PostDetailsActionBar;

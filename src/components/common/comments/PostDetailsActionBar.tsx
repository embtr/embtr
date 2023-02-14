import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { TIMELINE_CARD_ICON_COUNT_SIZE, TIMELINE_CARD_ICON_SIZE, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Comment, Like } from 'src/controller/timeline/TimelineController';
import { timelineEntryWasLikedBy } from 'src/controller/timeline/story/StoryController';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import LottieView from 'lottie-react-native';
import { wait } from 'src/util/GeneralUtility';

interface Props {
    likes: Like[];
    comments: Comment[];
    onLike: Function;
}

const PostDetailsActionBar = ({ likes, comments, onLike }: Props) => {
    const { colors } = useTheme();

    const isLiked = timelineEntryWasLikedBy(likes, getCurrentUid());
    const [heartPressed, setHeartPressed] = React.useState(isLiked);

    const animation = React.useRef(null);

    React.useEffect(() => {
        setHeartPressed(isLiked);
    }, [isLiked]);

    const onHeartPressed = () => {
        if (!heartPressed) {
            animation.current?.play();
            wait(1000).then(() => {
                animation.current?.reset();
            });
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setHeartPressed(true);
            onLike();
        }
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ height: 0, width: 0, position: 'relative' }}>
                <View style={{ position: 'absolute', zIndex: -1, width: 200, height: 200, left: -144, top: -27, transform: [{ scaleX: -1 }] }}>
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
                <TouchableOpacity onPress={heartPressed ? undefined : onHeartPressed}>
                    <Ionicons
                        name={heartPressed ? 'heart' : 'heart-outline'}
                        size={TIMELINE_CARD_ICON_SIZE}
                        color={heartPressed ? 'red' : colors.timeline_card_footer}
                    />
                </TouchableOpacity>

                <View style={{ justifyContent: 'center', paddingLeft: 4 }}>
                    <Text style={{ color: colors.timeline_card_footer, fontSize: TIMELINE_CARD_ICON_COUNT_SIZE, fontFamily: 'Poppins_500Medium' }}>
                        {likes.length}
                    </Text>
                </View>

                <View style={{ borderColor: colors.text, paddingLeft: 20 }}>
                    <Ionicons name={'chatbox-outline'} size={TIMELINE_CARD_ICON_SIZE} color={colors.timeline_card_footer} />
                </View>

                <View style={{ justifyContent: 'center', paddingLeft: 4 }}>
                    <Text style={{ color: colors.timeline_card_footer, fontSize: TIMELINE_CARD_ICON_COUNT_SIZE, fontFamily: 'Poppins_500Medium' }}>
                        {comments.length}
                    </Text>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    style={{ alignItems: 'flex-end', paddingRight: TIMELINE_CARD_PADDING }}
                    onPress={() => {
                        alert("I don't work yet :(");
                    }}
                >
                    <Ionicons name={'share-outline'} size={TIMELINE_CARD_ICON_SIZE} color={colors.timeline_card_footer} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PostDetailsActionBar;

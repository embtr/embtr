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

interface Props {
    likes: Like[];
    comments: Comment[];
    onLike: Function;
}

const PostDetailsActionBar = ({ likes, comments, onLike }: Props) => {
    const { colors } = useTheme();

    const isLiked = timelineEntryWasLikedBy(likes, getCurrentUid());
    const [heartPressed, setHeartPressed] = React.useState(isLiked);

    const onHeartPressed = () => {
        if (!heartPressed) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setHeartPressed(true);
            onLike();
        }
    };

    return (
        <View style={{ flexDirection: 'row' }}>
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

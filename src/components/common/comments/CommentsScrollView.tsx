import { View, Text } from 'react-native';
import { CommentBoxComment } from 'src/components/common/textbox/CommentBoxComment';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import SwipeableDeleteCard from '../swipeable/SwipeableDeleteCard';
import { Comment as CommentModel } from 'resources/schema';
import { POPPINS_MEDIUM, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    onDeleteComment?: Function;
    comments: CommentModel[];
    limit?: number;
}

export const CommentsScrollView = ({ comments, onDeleteComment, limit }: Props) => {
    const colors = useTheme().colors;
    let max = limit ? limit : comments.length;
    if (comments.length < max) {
        max = comments.length;
    }

    const currentUserUid = getCurrentUid();

    const commentViews = comments.map((comment, index) => {
        const isCurrentUsersComment = comment.user?.uid === currentUserUid;

        if (isCurrentUsersComment) {
            return (
                <SwipeableDeleteCard
                    key={comment.id}
                    onDelete={() => {
                        if (onDeleteComment) {
                            onDeleteComment(comment);
                        }
                    }}
                >
                    <View
                        style={{
                            paddingBottom: TIMELINE_CARD_PADDING / 1.5,
                        }}
                    >
                        <CommentBoxComment comment={comment} index={index} />
                    </View>
                </SwipeableDeleteCard>
            );
        } else {
            return (
                <View key={comment.id} style={{ paddingTop: TIMELINE_CARD_PADDING }}>
                    <CommentBoxComment comment={comment} index={index} />
                </View>
            );
        }
    });

    return (
        <View>
            <Text
                style={{
                    color: colors.text,
                    fontFamily: POPPINS_MEDIUM,
                    fontSize: 14,
                    paddingVertical: TIMELINE_CARD_PADDING / 2,
                    paddingLeft: TIMELINE_CARD_PADDING
                }}
            >
                Comments
            </Text>
            {commentViews}
        </View>
    );
};

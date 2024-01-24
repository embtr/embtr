import { View, Text, Dimensions } from 'react-native';
import { CommentBoxComment } from 'src/components/common/textbox/CommentBoxComment';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import SwipeableDeleteCard from '../swipeable/SwipeableDeleteCard';
import { Comment as CommentModel } from 'resources/schema';
import { POPPINS_MEDIUM, PADDING_LARGE, PADDING_MEDIUM } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    onDeleteComment?: Function;
    comments: CommentModel[];
    limit?: number;
}

export const CommentsScrollView = ({ comments, onDeleteComment, limit }: Props) => {
    const colors = useTheme().colors;
    const currentUserUid = getCurrentUid();

    const commentViews = comments.map((comment, index) => {
        const isCurrentUsersComment = comment.user?.uid === currentUserUid;

        if (isCurrentUsersComment) {
            return (
                <View
                    style={{
                        paddingBottom: PADDING_MEDIUM,
                        paddingHorizontal: PADDING_MEDIUM,
                    }}
                >
                    <SwipeableDeleteCard
                        key={comment.id}
                        onDelete={() => {
                            if (onDeleteComment) {
                                onDeleteComment(comment);
                            }
                        }}
                    >
                        <CommentBoxComment
                            comment={comment}
                            index={index}
                            isOwnPost={isCurrentUsersComment}
                        />
                    </SwipeableDeleteCard>
                </View>
            );
        } else {
            return (
                <View
                    key={comment.id}
                    style={{
                        paddingBottom: PADDING_MEDIUM,
                        paddingHorizontal: PADDING_MEDIUM,
                    }}
                >
                    <CommentBoxComment
                        comment={comment}
                        index={index}
                        isOwnPost={isCurrentUsersComment}
                    />
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
                    paddingVertical: PADDING_LARGE / 2,
                    paddingLeft: PADDING_LARGE,
                }}
            >
                Comments
            </Text>
            {commentViews}
        </View>
    );
};

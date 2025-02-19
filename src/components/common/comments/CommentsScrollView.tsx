import { View, Text } from 'react-native';
import { CommentBoxComment } from 'src/components/common/textbox/CommentBoxComment';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { Comment as CommentModel } from 'resources/schema';
import { POPPINS_MEDIUM, PADDING_LARGE, PADDING_MEDIUM } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { SwipeableCard } from '../swipeable/SwipeableCard';
import { SwipeableCardElementData } from '../swipeable/SwipeableCardElement';
import { Swipeable } from 'react-native-gesture-handler';
import React from 'react';

interface Props {
    onDeleteComment?: Function;
    comments: CommentModel[];
    limit?: number;
}

export const CommentsScrollView = ({ comments, onDeleteComment, limit }: Props) => {
    const colors = useTheme().colors;
    const currentUserUid = getCurrentUid();
    const ref = React.useRef<Swipeable>(null);

    const commentViews = comments.map((comment, index) => {
        const isCurrentUsersComment = comment.user?.uid === currentUserUid;

        const rightOptions: SwipeableCardElementData[] = [
            {
                text: 'Delete',
                color: colors.progress_bar_failed,
                onAction: () => {
                    if (onDeleteComment) {
                        onDeleteComment(comment);
                    }
                },
            },
        ];

        return (
            <View
                style={{
                    paddingBottom: PADDING_MEDIUM,
                    paddingHorizontal: PADDING_MEDIUM,
                }}
            >
                <SwipeableCard
                    ref={ref}
                    disabled={!isCurrentUsersComment}
                    rightOptions={rightOptions}
                    key={comment.id}
                >
                    <CommentBoxComment
                        comment={comment}
                        index={index}
                        isOwnPost={isCurrentUsersComment}
                    />
                </SwipeableCard>
            </View>
        );
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

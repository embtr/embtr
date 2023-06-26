import { View } from 'react-native';
import { CommentBoxComment } from 'src/components/common/textbox/CommentBoxComment';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import SwipeableDeleteCard from '../swipeable/SwipeableDeleteCard';
import { Comment as CommentModel } from 'resources/schema';

interface Props {
    onDeleteComment?: Function;
    comments: CommentModel[];
    limit?: number;
}

export const CommentsScrollView = ({ comments, onDeleteComment, limit }: Props) => {
    let max = limit ? limit : comments.length;
    if (comments.length < max) {
        max = comments.length;
    }

    const commentViews = comments.map((comment) => {
        const isCurrentUsersComment = comment.user?.uid === getCurrentUid();

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
                    <View style={{ marginBottom: 7.5, paddingTop: 15 }}>
                        <CommentBoxComment comment={comment} />
                    </View>
                </SwipeableDeleteCard>
            );
        } else {
            return (
                <View key={comment.id} style={{ marginBottom: 7.5, paddingTop: 15 }}>
                    <CommentBoxComment comment={comment} />
                </View>
            );
        }
    });

    return <View>{commentViews}</View>;
};

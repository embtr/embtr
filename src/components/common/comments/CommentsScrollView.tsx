import { View } from 'react-native';
import { CommentBoxComment } from 'src/components/common/textbox/CommentBoxComment';
import { Comment } from 'src/controller/timeline/TimelineController';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import SwipeableDeleteCard from '../swipeable/SwipeableDeleteCard';

interface Props {
    onDeleteComment: Function;
    comments: Comment[];
}

export const CommentsScrollView = ({ comments, onDeleteComment }: Props) => {
    let commentViews: JSX.Element[] = [];
    comments.forEach((comment) => {
        const isCurrentUsersComment = comment.uid === getCurrentUid();

        if (isCurrentUsersComment) {
            commentViews.push(
                <SwipeableDeleteCard
                    onDelete={() => {
                        onDeleteComment(comment);
                    }}
                >
                    <View key={comment.uid + comment.comment + comment.timestamp} style={{ marginBottom: 7.5, paddingTop: 15 }}>
                        <CommentBoxComment comment={comment} />
                    </View>
                </SwipeableDeleteCard>
            );
        } else {
            commentViews.push(
                <View key={comment.uid + comment.comment + comment.timestamp} style={{ marginBottom: 7.5, paddingTop: 15 }}>
                    <CommentBoxComment comment={comment} />
                </View>
            );
        }
    });

    return <View>{commentViews}</View>;
};

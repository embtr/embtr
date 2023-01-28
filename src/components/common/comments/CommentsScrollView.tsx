import { View } from 'react-native';
import { CommentBoxComment } from 'src/components/common/textbox/CommentBoxComment';
import { Comment } from 'src/controller/timeline/TimelineController';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import SwipeableDeleteCard from '../swipeable/SwipeableDeleteCard';

interface Props {
    onDeleteComment?: Function;
    comments: Comment[];
    limit?: number;
}

export const CommentsScrollView = ({ comments, onDeleteComment, limit }: Props) => {
    let commentViews: JSX.Element[] = [];

    const max = limit ? limit : comments.length;
    for (let i = 0; i < max; i++) {
        const comment: Comment = comments[i];

        const isCurrentUsersComment = comment.uid === getCurrentUid();

        if (isCurrentUsersComment) {
            commentViews.push(
                <SwipeableDeleteCard
                    key={comment.comment + comment.uid + comment.timestamp.toString()}
                    onDelete={() => {
                        if (onDeleteComment) {
                            onDeleteComment(comment);
                        }
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
    }

    return <View>{commentViews}</View>;
};

import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { CommentBoxComment } from 'src/components/common/textbox/CommentBoxComment';
import { Comment } from 'src/controller/timeline/TimelineController';

interface Props {
    comments: Comment[]
}

export const CommentsScrollView = ({ comments }: Props) => {
    let commentViews: JSX.Element[] = [];
    comments.forEach(comment => {
        commentViews.push(
            <View key={comment.uid + comment.comment + comment.timestamp} style={{ marginBottom: 7.5, paddingTop: 15 }}>
                <CommentBoxComment comment={comment} />
            </View>
        );
    });

    return (
        <View>
            {commentViews}
        </View>
    );
}
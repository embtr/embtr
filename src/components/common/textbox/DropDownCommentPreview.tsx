import * as React from 'react';
import { View } from 'react-native';
import { Comment } from 'src/components/common/timeline/comments/Comment';
import { CommentModel } from 'src/controller/explore/ExploreController';

interface Props {
    comment: CommentModel
}

export const DropDownCommentPreview = ({comment} : Props) => {
    return (
        <View style={{ width: "100%", overflow: "hidden" }}>
            <Comment comment={comment} />
        </View>
    );
};
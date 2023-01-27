import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { CommentsTextInput } from 'src/components/common/comments/CommentsTextInput';
import { KeyboardAvoidingView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { isIosApp } from 'src/util/DeviceUtil';
import React from 'react';

interface Props {
    currentUser: UserProfileModel;
    postOwner: UserProfileModel;
    submitComment: Function;
    children: any;
}

const ScrollableTextInputBox = ({ currentUser, postOwner, submitComment, children }: Props) => {
    const scrollRef = React.useRef<ScrollView>(null);

    const onCommentCountChanged = (width: number, height: number) => {
        //scrollRef.current?.scrollTo({ x: 0, y: height, animated: true });
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={isIosApp() ? 40 : 0} behavior={isIosApp() ? 'padding' : undefined}>
            <ScrollView style={{ flex: 1 }} onContentSizeChange={onCommentCountChanged} ref={scrollRef}>
                {children}
            </ScrollView>

            <CommentsTextInput currentUserProfile={currentUser} authorUserProfile={postOwner} submitComment={submitComment} />
        </KeyboardAvoidingView>
    );
};

export default ScrollableTextInputBox;

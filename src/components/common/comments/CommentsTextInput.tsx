import { getAuth } from 'firebase/auth';
import * as React from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import { UserTagBox } from 'src/components/common/comments/user_tags/UserTagBox';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { UsernameTagTracker } from 'src/util/user/UsernameTagTracker';

interface Props {
    submitComment: Function;
    currentUserProfile: UserProfileModel;
    authorUserProfile: UserProfileModel;
}

export const CommentsTextInput = ({ submitComment, currentUserProfile, authorUserProfile }: Props) => {
    const { colors } = useTheme();

    const [commentText, setCommentText] = React.useState('');
    const [taggedUsers, setTaggedUsers] = React.useState<UserProfileModel[]>([]);
    const [focused, setFocused] = React.useState<boolean>(false);

    const submitCommentPressed = () => {
        if (commentText === '') {
            return;
        }

        const encodedComment: string = UsernameTagTracker.encodeTaggedUsers(commentText, taggedUsers);

        Keyboard.dismiss();
        submitComment(encodedComment, taggedUsers);
        setCommentText('');
        setTaggedUsers([]);
    };

    const applyUsernameTag = (userProfile: UserProfileModel) => {
        let newComment = UsernameTagTracker.clearUsernameTag(commentText);
        newComment += userProfile.name + ' ';
        setCommentText(newComment);

        let applyTag = true;
        if (userProfile.uid === authorUserProfile.uid) {
            applyTag = false;
        }

        if (userProfile.uid === getAuth().currentUser!.uid) {
            applyTag = false;
        }

        taggedUsers.forEach((taggedUser) => {
            if (taggedUser.uid === userProfile.uid) {
                applyTag = false;
            }
        });

        if (!applyTag) {
            return;
        }

        let newTaggedUsers: UserProfileModel[] = taggedUsers.slice();
        newTaggedUsers.push(userProfile);
        setTaggedUsers(newTaggedUsers);
    };

    return (
        <View
            style={{
                width: '100%',
                paddingLeft: focused ? 0 : 5,
                paddingRight: focused ? 0 : 5,
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <View
                style={{
                    backgroundColor: colors.text_input_background,
                    borderRadius: focused ? 0 : 15,
                    marginBottom: 6,
                    paddingTop: 8,
                    paddingBottom: 8,
                    flex: 1,
                }}
            >
                <UserTagBox input={commentText} userTagged={applyUsernameTag} />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <View style={{ paddingLeft: 10 }}>
                        {currentUserProfile && <NavigatableUserImage userProfileModel={currentUserProfile} size={30} denyNavigation={true} />}
                    </View>
                    <TextInput
                        style={{ paddingLeft: 10, color: colors.text, flex: 1 }}
                        placeholder={'add a comment...'}
                        placeholderTextColor={colors.secondary_text}
                        onChangeText={(text) => setCommentText(text)}
                        value={commentText}
                        onSubmitEditing={() => {
                            submitCommentPressed();
                        }}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                    />

                    <View style={{ width: 90, paddingRight: 15 }}>
                        <EmbtrButton
                            buttonText={'send'}
                            callback={() => {
                                submitCommentPressed();
                            }}
                            height={40}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

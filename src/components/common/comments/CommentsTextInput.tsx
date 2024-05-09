import * as React from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserTagBox } from 'src/components/common/comments/user_tags/UserTagBox';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/model/OldModels';
import { getWindowWidth } from 'src/util/GeneralUtility';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_REGULAR } from 'src/util/constants';
import { UsernameTagTracker } from 'src/util/user/UsernameTagTracker';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    submitComment: Function;
}

export const CommentsTextInput = ({ submitComment }: Props) => {
    const { colors } = useTheme();

    const [commentText, setCommentText] = React.useState('');
    const [taggedUsers, setTaggedUsers] = React.useState<UserProfileModel[]>([]);
    const [focused, setFocused] = React.useState<boolean>(false);

    const insets = useSafeAreaInsets();

    const submitCommentPressed = () => {
        if (commentText === '') {
            return;
        }

        const encodedComment: string = UsernameTagTracker.encodeTaggedUsers(
            commentText,
            taggedUsers
        );

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
                paddingHorizontal: focused ? 0 : PADDING_LARGE,
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                marginBottom: insets.bottom > 0 ? insets.bottom : PADDING_SMALL,
            }}
        >
            <View
                style={{
                    backgroundColor: colors.text_input_background,

                    borderRadius: focused ? 0 : 25,
                    paddingTop: 8,
                    paddingBottom: 8,
                    flex: 1,
                }}
            >
                <UserTagBox input={commentText} userTagged={applyUsernameTag} />

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >
                    <View>
                        {/*currentUserProfile && <NavigatableUserImage userProfileModel={currentUserProfile} size={30} denyNavigation={true} />*/}
                    </View>
                    <TextInput
                        multiline={true}
                        autoCorrect={true}
                        style={{
                            flex: 1,
                            minHeight: 30,
                            maxHeight: focused ? getWindowWidth() / 3 : 40,
                            paddingHorizontal: PADDING_LARGE,
                            color: colors.text,
                            fontFamily: POPPINS_REGULAR,
                        }}
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

                    <View
                        style={{
                            paddingRight: PADDING_LARGE,
                            opacity: commentText.length ? 1 : 0.3,
                        }}
                    >
                        <Ionicons
                            onPress={commentText.length ? submitCommentPressed : undefined}
                            name={'paper-plane-outline'}
                            size={26}
                            color={commentText.length ? colors.link : colors.secondary_text}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

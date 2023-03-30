import * as React from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { formatDistance } from 'date-fns';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { UsernameTagTracker } from 'src/util/user/UsernameTagTracker';
import { COMMENT_ICON_SIZE } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';
import { Comment } from 'resources/schema';

interface Props {
    comment: Comment;
}

export const CommentBoxComment = ({ comment }: Props) => {
    const { colors } = useTheme();

    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);
    const [decodedComment, setDecodedComment] = React.useState<JSX.Element | undefined>(undefined);

    const heartPressed = false;

    useFocusEffect(
        React.useCallback(() => {
            if (comment && comment.user?.uid) {
                ProfileController.getProfile(comment.user.uid, setUserProfileModel);
            }

            if (comment && comment.comment) {
                UsernameTagTracker.dencodeTaggedUsers(comment.comment, colors, setDecodedComment);
            }
        }, [comment])
    );

    const time = formatDistance(comment.createdAt ?? new Date(), new Date(), { addSuffix: true });
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row', marginRight: 10, marginLeft: 10, flex: 1 }}>
                <View>{userProfileModel && <NavigatableUserImage userProfileModel={userProfileModel} size={30} />}</View>

                <View style={{ marginLeft: 5, marginRight: 20, flexShrink: 1, paddingLeft: 5 }}>
                    <Text style={{ color: colors.timeline_card_header, fontWeight: 'bold', fontFamily: 'Poppins_500Medium', fontSize: 14 }}>
                        {userProfileModel?.name}
                    </Text>
                    {decodedComment && (
                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.timeline_card_header, paddingTop: 1 }}>
                            {decodedComment}
                        </Text>
                    )}
                    <Text style={{ color: 'gray', fontSize: 10, paddingTop: 1 }}>{time}</Text>
                </View>
            </View>

            <View style={{ paddingRight: 30, justifyContent: 'center' }}>
                <Ionicons name={heartPressed ? 'heart' : 'heart-outline'} size={COMMENT_ICON_SIZE} color={heartPressed ? 'red' : colors.timeline_card_header} />
            </View>
        </View>
    );
};

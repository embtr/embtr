import * as React from 'react';
import { View, Image, Text } from "react-native"
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Comment } from 'src/controller/explore/ExploreController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';

interface Props {
    comment: Comment
}

export const CommentBoxComment = ({ comment }: Props) => {
    const { colors } = useTheme();

    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);

    useFocusEffect(
        React.useCallback(() => {
            if (comment && comment.uid) {
                ProfileController.getProfile(comment.uid, setUserProfileModel);
            }
        }, [comment, comment.uid])
    );

    return (
        <View style={{ flexDirection: "row", marginRight: 10, marginLeft: 30 }}>
            <View>
                <Image style={{ width: 20, height: 20, borderRadius: 50 }} source={{ uri: userProfileModel ? userProfileModel.photoUrl : undefined }} />

            </View>
            <View style={{ marginLeft: 5, marginRight: 20, flexShrink: 1 }}>
                <Text numberOfLines={2} style={{ color: colors.text }}><Text style={{ fontWeight:"bold"}}>{userProfileModel?.name}: </Text>{comment.comment}</Text>
            </View>
        </View>
    )
}
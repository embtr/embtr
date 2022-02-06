import * as React from 'react';
import { View, Image, Text } from "react-native"
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CommentModel } from 'src/controller/explore/ExploreController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { formatDistance } from 'date-fns';

interface Props {
    comment: CommentModel
}

export const Comment = ({ comment }: Props) => {
    const { colors } = useTheme();

    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);

    useFocusEffect(
        React.useCallback(() => {
            if (comment && comment.uid) {
                ProfileController.getProfile(comment.uid, setUserProfileModel);
            }
        }, [comment, comment.uid])
    );

    const time = formatDistance(comment.timestamp.toDate(), new Date(), { addSuffix: true });

    return (
        <View>
            <View style={{ flexDirection: "row", marginRight: 10, marginLeft: 10 }}>
                <View>
                    <Image style={{ width: 30, height: 30, borderRadius: 50 }} source={{ uri: userProfileModel ? userProfileModel.photoUrl : undefined }} />

                </View>
                <View style={{ marginLeft: 5, marginRight: 20, flexShrink: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: "bold" }}>{userProfileModel?.name} <Text style={{ color: colors.text, fontWeight: "normal" }}>{comment.comment}</Text></Text>
                    <Text style={{ color: "gray", fontSize: 12 }}>{time}</Text>
                </View>
            </View>
        </View>
    )
}
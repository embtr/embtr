import * as React from 'react';
import { Text, View } from 'react-native';
import { UserImage } from 'src/components/profile/UserImage';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

interface Props {
    userProfile: UserProfileModel
}

export const UserTag = ({ userProfile }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ flexDirection: "row", padding: 5, margin: 1, backgroundColor: colors.background }}>
            <View>
                <UserImage userProfileModel={userProfile} size={20} />
            </View>
            <View>
                <Text style={{ color: colors.text }}>{userProfile.name}</Text>
            </View>
        </View>
    )
}
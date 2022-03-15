import * as React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UserImage } from 'src/components/profile/UserImage';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

interface Props {
    userProfile: UserProfileModel,
    onPress: Function
}

export const UserTag = ({ userProfile, onPress }: Props) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity onPress={() => { onPress(userProfile) }}>
            <View style={{ flexDirection: "row", padding: 5, margin: 1, backgroundColor: colors.background }}>
                <View>
                    <UserImage userProfileModel={userProfile} size={20} />
                </View>
                <View>
                    <Text style={{ color: colors.text }}>{userProfile.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
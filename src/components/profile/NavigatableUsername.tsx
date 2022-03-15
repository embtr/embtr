import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { useTheme } from 'src/components/theme/ThemeProvider';

type userProfileScreenProp = StackNavigationProp<TimelineTabScreens, 'UserProfile'>;

interface Props {
    userProfile: UserProfileModel
}

export const NavigatableUsername = ({ userProfile }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<userProfileScreenProp>();
    const toUserProfile = () => {
        navigation.navigate('UserProfile', { id: userProfile?.uid ? userProfile.uid : "" })
    };

    return (
        <Text onPress={toUserProfile} style={{ color: colors.primary_border, fontWeight: "normal" }}>{userProfile.name}</Text>
    );
}
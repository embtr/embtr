import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentTab } from 'src/redux/user/GlobalState';
import { getNavigationHook } from 'src/util/navigation/NavigationHookProvider';

interface Props {
    userProfile: UserProfileModel;
}

export const NavigatableUsername = ({ userProfile }: Props) => {
    const { colors } = useTheme();

    const currentTab = useAppSelector(getCurrentTab);
    const navigation = getNavigationHook(currentTab)();

    const toUserProfile = () => {
        // @ts-ignore
        navigation.navigate('UserProfile', { id: userProfile?.uid ? userProfile.uid : '' });
    };

    return (
        <Text onPress={toUserProfile} style={{ color: colors.primary_border, fontWeight: 'normal' }}>
            {userProfile.name}
        </Text>
    );
};

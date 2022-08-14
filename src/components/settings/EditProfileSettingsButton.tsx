import * as React from 'react';
import { SettingsButtonElement } from 'src/components/settings/SettingsButtonElement';
import { ProfileTabScreens } from 'src/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export const EditProfileSettingsButton = () => {
    const navigation = useNavigation<StackNavigationProp<ProfileTabScreens>>();

    return <SettingsButtonElement text={"Edit Profile"} icon={"ios-pencil-sharp"} onPress={() => { navigation.navigate("EditUserProfile") }} />
};
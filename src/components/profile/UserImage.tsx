import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Image, TouchableOpacity } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';

type userProfileScreenProp = StackNavigationProp<TimelineTabScreens, 'UserProfile'>;

interface Props {
    userProfileModel: UserProfileModel,
    size: number
}

export const UserImage = ({ userProfileModel, size }: Props) => {
    return <NavigatableUserImage userProfileModel={userProfileModel} size={size} denyNavigation={true} />
}
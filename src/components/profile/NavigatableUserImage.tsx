import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Image, TouchableOpacity } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { ProfileLevel } from './profile_component/ProfileLevel';

type userProfileScreenProp = StackNavigationProp<TimelineTabScreens, 'UserProfile'>;

interface Props {
    userProfileModel: UserProfileModel;
    size: number;
    denyNavigation?: boolean;
}

export const NavigatableUserImage = ({ userProfileModel, size, denyNavigation }: Props) => {
    const navigation = useNavigation<userProfileScreenProp>();
    const toUserProfile = () => {
        navigation.navigate('UserProfile', { id: userProfileModel?.uid ? userProfileModel.uid : '' });
    };

    return denyNavigation ? (
        <View>
            <Image style={{ width: size, height: size, borderRadius: 50 }} source={{ uri: userProfileModel ? userProfileModel.photoUrl : undefined }} />
        </View>
    ) : (
        <View>
            <TouchableOpacity onPress={toUserProfile}>
                <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <Image style={{ width: size, height: size, borderRadius: 50 }} source={{ uri: userProfileModel ? userProfileModel.photoUrl : undefined }} />
                    <View style={{ position: 'absolute', zIndex: 1, paddingBottom: 1, paddingRight: 1 }}>
                        <ProfileLevel userProfileModel={userProfileModel} useSmall={true} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

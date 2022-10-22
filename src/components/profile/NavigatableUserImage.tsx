import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Image } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { ProfileLevel } from './profile_component/ProfileLevel';
import { CachedImage } from '../common/images/CachedImage';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

type userProfileScreenProp = StackNavigationProp<TimelineTabScreens, 'UserProfile'>;

interface Props {
    userProfileModel: UserProfileModel;
    size: number;
    denyNavigation?: boolean;
}

export const NavigatableUserImage = ({ userProfileModel, size, denyNavigation }: Props) => {
    const navigation = useNavigation<userProfileScreenProp>();
    const toUserProfile = () => {
        if (userProfileModel.uid === 'system') {
            return;
        }

        navigation.navigate('UserProfile', { id: userProfileModel?.uid ? userProfileModel.uid : '' });
    };

    return !userProfileModel.photoUrl ? (
        <View />
    ) : denyNavigation ? (
        <View>
            <Image style={{ width: size, height: size, borderRadius: 50 }} source={{ uri: userProfileModel.photoUrl }} />
        </View>
    ) : (
        <View>
            <TouchableWithoutFeedback onPress={toUserProfile}>
                <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <CachedImage uri={userProfileModel.photoUrl} style={{ width: size, height: size, borderRadius: 50 }} />
                    <View style={{ position: 'absolute', zIndex: 1, paddingBottom: 1, paddingRight: 1 }}>
                        <ProfileLevel userProfileModel={userProfileModel} useSmall={true} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

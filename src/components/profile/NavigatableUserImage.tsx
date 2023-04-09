import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Image } from 'react-native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { CachedImage } from '../common/images/CachedImage';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { User } from 'resources/schema';

type userProfileScreenProp = StackNavigationProp<TimelineTabScreens, 'UserProfile'>;

interface Props {
    user: User;
    size: number;
    denyNavigation?: boolean;
}

export const NavigatableUserImage = ({ user, size, denyNavigation }: Props) => {
    const navigation = useNavigation<userProfileScreenProp>();
    const toUserProfile = () => {
        if (user.uid === 'system') {
            return;
        }

        navigation.navigate('UserProfile', { id: user?.uid ? user.uid : '' });
    };

    return !user.photoUrl ? (
        <View />
    ) : denyNavigation ? (
        <View>
            <Image style={{ width: size, height: size, borderRadius: 50 }} source={{ uri: user.photoUrl }} />
        </View>
    ) : (
        <View>
            <TouchableWithoutFeedback onPress={toUserProfile}>
                <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <CachedImage uri={user.photoUrl} style={{ width: size, height: size, borderRadius: 50 }} />
                    <View style={{ position: 'absolute', zIndex: 1, paddingBottom: 1, paddingRight: 1 }}>
                        {/* <ProfileLevel userProfileModel={userProfileModel} useSmall={true} /> */}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

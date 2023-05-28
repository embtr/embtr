import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Image } from 'react-native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { CachedImage } from '../common/images/CachedImage';
import { TouchableWithoutFeedback } from 'react-native';
import { User } from 'resources/schema';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

type userProfileScreenProp = StackNavigationProp<TimelineTabScreens, 'UserProfile'>;

interface Props {
    user: User;
    size: number;
    denyNavigation?: boolean;
}

export const NavigatableUserImage = ({ user, size, denyNavigation }: Props) => {
    const navigation = useNavigation<userProfileScreenProp>();
    const { colors } = useTheme();
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
            <Image
                style={{ width: size, height: size, borderRadius: 50 }}
                source={{ uri: user.photoUrl }}
            />
        </View>
    ) : (
        <View>
            <TouchableWithoutFeedback onPress={toUserProfile}>
                <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    {/* GEM SLOTS */}

                    {/*
                    <View style={{ zIndex: 1, position: 'absolute', left: 8, top: -11 }}>
                        <Ionicons name={'water-outline'} size={10} color={colors.tab_selected} />
                    </View>

                    <View style={{ zIndex: 1, position: 'absolute', left: -2, top: -5 }}>
                        <Ionicons name={'fitness-outline'} size={10} color={colors.tab_selected} />
                    </View>

                    <View style={{ zIndex: 1, position: 'absolute', left: -10, top: 5 }}>
                        <Ionicons name={'book-outline'} size={10} color={colors.tab_selected} />
                    </View>
                    */}
                    <CachedImage
                        uri={user.photoUrl}
                        style={{ width: size, height: size, borderRadius: 50 }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 1,
                            paddingBottom: 1,
                            paddingRight: 1,
                        }}
                    >
                        {/* <ProfileLevel userProfileModel={userProfileModel} useSmall={true} /> */}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { CachedImage } from '../common/images/CachedImage';
import { TouchableWithoutFeedback } from 'react-native';
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

    if (!user?.photoUrl) {
        return <View />;
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={toUserProfile}>
                <View style={styles.imageContainer}>
                    <CachedImage
                        uri={user.photoUrl}
                        style={[styles.image, { width: size, height: size }]}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // Add any container styles if needed
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        overflow: 'hidden',
        borderRadius: 100,
    },
});

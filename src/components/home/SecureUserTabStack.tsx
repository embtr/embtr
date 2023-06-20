import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserSettings } from 'src/components/profile/UserSettings';
import { CurrentUserProfile } from 'src/components/profile/CurrentUserProfile';
import { EditUserProfile } from 'src/components/profile/EditUserProfile';
import { UserPostDetails } from '../common/timeline/UserPostDetails';
import { UserProfile } from '../profile/UserProfile';
import { UserPosts } from 'src/components/profile/details/UserPosts';

const Stack = createNativeStackNavigator();

export const SecureUserTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={CurrentUserProfile} />
            <Stack.Screen name="UserSettings" component={UserSettings} />
            <Stack.Screen name="EditUserProfile" component={EditUserProfile} />
            <Stack.Screen name="UserPostDetails" component={UserPostDetails} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="UserPosts" component={UserPosts} />
        </Stack.Navigator>
    );
};

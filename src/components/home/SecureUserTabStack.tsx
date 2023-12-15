import { CurrentUserProfile } from 'src/components/profile/CurrentUserProfile';
import { EditUserProfile } from 'src/components/profile/EditUserProfile';
import { UserPostDetails } from '../common/timeline/UserPostDetails';
import { UserProfile } from '../profile/UserProfile';
import { UserPosts } from 'src/components/profile/details/UserPosts';
import { DailyResults } from 'src/components/profile/details/DailyResults';
import { DailyResultDetails } from '../common/timeline/DailyResultDetails';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const SecureUserTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={CurrentUserProfile} />
            <Stack.Screen name="EditUserProfile" component={EditUserProfile} />
            <Stack.Screen name="UserPostDetails" component={UserPostDetails} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="UserPosts" component={UserPosts} />
            <Stack.Screen name="DailyResults" component={DailyResults} />
            <Stack.Screen name="DailyResultDetails" component={DailyResultDetails} />
        </Stack.Navigator>
    );
};

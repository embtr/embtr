import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserSearch } from 'src/components/profile/search/UserSearch';
import { UserProfile } from 'src/components/profile/UserProfile';
import { Timeline } from 'src/components/timeline/Timeline';
import { CreateUserPost } from 'src/components/timeline/CreateUserPost';
import { Notifications } from 'src/components/notification/Notifications';
import { DailyResultDetails } from 'src/components/common/timeline/DailyResultDetails';
import { UserPostDetails } from 'src/components/common/timeline/UserPostDetails';
import { EditUserPostDetails } from '../timeline/EditUserPostDetails';
import { EditDailyResultDetails } from '../common/timeline/EditDailyResultDetails';
import { UserPosts } from 'src/components/profile/details/UserPosts';
import { DailyResults } from 'src/components/profile/details/DailyResults';
import { ChallengeDetails } from '../common/timeline/challenges/ChallengeDetails';
import { AddTasks } from '../plan/planning/AddTasks';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const SecureTimelineTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Timeline" component={Timeline} />
            <Stack.Screen
                name="CreateUserPost"
                component={CreateUserPost}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen name="UserSearch" component={UserSearch} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="EditUserPostDetails" component={EditUserPostDetails} />
            <Stack.Screen name="EditDailyResultDetails" component={EditDailyResultDetails} />
            <Stack.Screen name="UserPostDetails" component={UserPostDetails} />
            <Stack.Screen name="DailyResultDetails" component={DailyResultDetails} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="UserPosts" component={UserPosts} />
            <Stack.Screen name="DailyResults" component={DailyResults} />
            <Stack.Screen name="ChallengeDetails" component={ChallengeDetails} />
        </Stack.Navigator>
    );
};

import { UserSearch } from 'src/components/profile/search/UserSearch';
import { UserProfile } from 'src/components/profile/UserProfile';
import { Timeline } from 'src/components/timeline/Timeline';
import { Notifications } from 'src/components/notification/Notifications';
import { DailyResultDetails } from 'src/components/common/timeline/DailyResultDetails';
import { UserPostDetails } from 'src/components/common/timeline/UserPostDetails';
import { UserPosts } from 'src/components/profile/details/UserPosts';
import { DailyResults } from 'src/components/profile/details/DailyResults';
import { createStackNavigator } from '@react-navigation/stack';
import { AddHabitCategory } from 'src/components/plan/habit/AddHabitCategory';
import { EditUserPostDetails } from 'src/components/timeline/EditUserPostDetails';
import { EditDailyResultDetails } from 'src/components/common/timeline/EditDailyResultDetails';
import { ChallengeDetailsView } from '../common/timeline/challenges/ChallengeDetailsView';

const Stack = createStackNavigator();

export const SecureTimelineTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Timeline" component={Timeline} />
            <Stack.Screen name="UserSearch" component={UserSearch} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="EditUserPostDetails" component={EditUserPostDetails} />
            <Stack.Screen name="EditDailyResultDetails" component={EditDailyResultDetails} />
            <Stack.Screen name="UserPostDetails" component={UserPostDetails} />
            <Stack.Screen name="DailyResultDetails" component={DailyResultDetails} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="UserPosts" component={UserPosts} />
            <Stack.Screen name="DailyResults" component={DailyResults} />
            <Stack.Screen name="ChallengeDetailsView" component={ChallengeDetailsView} />
            <Stack.Screen name="AddHabit" component={AddHabitCategory} />
        </Stack.Navigator>
    );
};

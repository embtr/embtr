import { UserSearch } from 'src/components/profile/search/UserSearch';
import { UserProfile } from 'src/components/profile/UserProfile';
import { Timeline } from 'src/components/timeline/Timeline';
import { Notifications } from 'src/components/notification/Notifications';
import { UserPosts } from 'src/components/profile/details/UserPosts';
import { DailyResults } from 'src/components/profile/details/DailyResults';
import { createStackNavigator } from '@react-navigation/stack';
import { AddHabitCategory } from 'src/components/plan/habit/AddHabitCategory';
import { ChallengeDetailsView } from '../common/timeline/challenges/ChallengeDetailsView';
import { Routes } from 'src/navigation/RootStackParamList';
import { EditUserPost } from '../timeline/user_post/crud/EditUserPost';
import { EditPlannedDayResult } from '../timeline/planned_day_result/crud/EditPlannedDayResult';
import { UserPostDetails } from '../timeline/user_post/UserPostDetails';

const Stack = createStackNavigator();

export const SecureTimelineTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Timeline" component={Timeline} />
            <Stack.Screen name="UserSearch" component={UserSearch} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name={Routes.EDIT_USER_POST} component={EditUserPost} />
            <Stack.Screen name={Routes.EDIT_PLANNED_DAY_RESULT} component={EditPlannedDayResult} />
            <Stack.Screen name="UserPostDetails" component={UserPostDetails} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="UserPosts" component={UserPosts} />
            <Stack.Screen name="DailyResults" component={DailyResults} />
            <Stack.Screen name="ChallengeDetailsView" component={ChallengeDetailsView} />
            <Stack.Screen name="AddHabit" component={AddHabitCategory} />
        </Stack.Navigator>
    );
};

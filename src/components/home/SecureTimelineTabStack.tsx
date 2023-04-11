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

const Stack = createNativeStackNavigator();

export const SecureTimelineTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Timeline" component={Timeline} />
            <Stack.Screen name="CreateUserPost" component={CreateUserPost} />
            <Stack.Screen name="UserSearch" component={UserSearch} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="EditUserPostDetails" component={EditUserPostDetails} />
            <Stack.Screen name="EditDailyResultDetails" component={EditDailyResultDetails} />
            <Stack.Screen name="UserPostDetails" component={UserPostDetails} />
            <Stack.Screen name="DailyResultDetails" component={DailyResultDetails} />
            <Stack.Screen name="Notifications" component={Notifications} />
        </Stack.Navigator>
    );
};

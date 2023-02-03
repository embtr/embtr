import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserSettings } from 'src/components/profile/UserSettings';
import { CurrentUserProfile } from 'src/components/profile/CurrentUserProfile';
import { EditUserProfile } from 'src/components/profile/EditUserProfile';
import { PillarDetails } from '../profile/profile_component/pillar/PillarDetails';
import { CreateEditPillar } from '../profile/profile_component/pillar/CreateEditPillar';
import { GoalDetails } from '../plan/goals/GoalDetails';
import { UserPostDetails } from '../common/timeline/UserPostDetails';
import { UserProfile } from '../profile/UserProfile';

const Stack = createNativeStackNavigator();

export const SecureUserTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={CurrentUserProfile} />
            <Stack.Screen name="UserSettings" component={UserSettings} />
            <Stack.Screen name="EditUserProfile" component={EditUserProfile} />
            <Stack.Screen name="PillarDetails" component={PillarDetails} />
            <Stack.Screen name="CreateEditPillar" component={CreateEditPillar} />
            <Stack.Screen name="GoalDetails" component={GoalDetails} />
            <Stack.Screen name="UserPostDetails" component={UserPostDetails} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
        </Stack.Navigator>
    );
};

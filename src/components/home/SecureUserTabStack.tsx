import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserSettings } from 'src/components/profile/UserSettings';
import { CurrentUserProfile } from 'src/components/profile/CurrentUserProfile';
import { EditUserProfile } from 'src/components/profile/EditUserProfile';
import { PillarDetails } from '../profile/profile_component/pillar/PillarDetails';
import { CreateEditPillar } from '../profile/profile_component/pillar/CreateEditPillar';

const Stack = createNativeStackNavigator();

export const SecureUserTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={CurrentUserProfile} />
            <Stack.Screen name="UserSettings" component={UserSettings} />
            <Stack.Screen name="EditUserProfile" component={EditUserProfile} />
            <Stack.Screen name="PillarDetails" component={PillarDetails} />
            <Stack.Screen name="CreateEditPillar" component={CreateEditPillar} />
        </Stack.Navigator>
    );
};

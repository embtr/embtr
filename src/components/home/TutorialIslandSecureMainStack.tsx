import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { TutorialIslandDashboard } from '../tutorial/TutorialIslandDashboard';
import { TutorialIslandRoutes } from 'src/navigation/RootStackParamList';
import { TutorialIslandCreateEditScheduledHabit } from '../tutorial/TutorialIslandCreateEditScheduledHabit';

const Stack = createStackNavigator();

export const TutorialIslandSecureMainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={TutorialIslandRoutes.TUTORIAL_ISLAND_DASHBOARD}
                component={TutorialIslandDashboard}
            />
            <Stack.Screen
                name={TutorialIslandRoutes.TUTORIAL_ISLAND_CREATE_EDIT_SCHEDULED_HABIT}
                component={TutorialIslandCreateEditScheduledHabit}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
        </Stack.Navigator>
    );
};

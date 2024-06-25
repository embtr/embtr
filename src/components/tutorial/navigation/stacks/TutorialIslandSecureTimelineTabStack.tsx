import { createStackNavigator } from '@react-navigation/stack';
import { TutorialIslandTimeline } from '../../TutorialIslandTimeline';
import { TutorialIslandRoutes } from 'src/navigation/RootStackParamList';

const Stack = createStackNavigator();

export const TutorialIslandSecureTimelineTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={TutorialIslandRoutes.TUTORIAL_ISLAND_TIMELINE}
                component={TutorialIslandTimeline}
            />
        </Stack.Navigator>
    );
};

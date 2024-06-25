import { createStackNavigator } from '@react-navigation/stack';
import { TutorialIslandTimeline } from '../../TutorialIslandTimeline';

const Stack = createStackNavigator();

export const TutorialIslandSecureMyJourneyTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="journey" component={TutorialIslandTimeline} />
        </Stack.Navigator>
    );
};

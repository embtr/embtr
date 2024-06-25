import { createStackNavigator } from '@react-navigation/stack';
import { TutorialIslandTimeline } from '../../TutorialIslandTimeline';

const Stack = createStackNavigator();

export const TutorialIslandSecureMyHabitsTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="myhabits" component={TutorialIslandTimeline} />
        </Stack.Navigator>
    );
};

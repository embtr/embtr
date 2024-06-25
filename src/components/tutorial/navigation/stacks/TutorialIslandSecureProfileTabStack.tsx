import { createStackNavigator } from '@react-navigation/stack';
import { TutorialIslandTimeline } from '../../TutorialIslandTimeline';

const Stack = createStackNavigator();

export const TutorialIslandSecureProfileTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="profiletag" component={TutorialIslandTimeline} />
        </Stack.Navigator>
    );
};

import { createStackNavigator } from '@react-navigation/stack';
import { TutorialIslandTimeline } from '../../TutorialIslandTimeline';

const Stack = createStackNavigator();

export const TutorialIslandSecureTodayTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="todayy" component={TutorialIslandTimeline} />
        </Stack.Navigator>
    );
};

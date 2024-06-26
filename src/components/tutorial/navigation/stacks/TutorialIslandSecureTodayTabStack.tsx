import { createStackNavigator } from '@react-navigation/stack';
import { TutorialIslandRoutes } from 'src/navigation/RootStackParamList';
import { TutorialIslandToday } from '../../TutorialIslandToday';

const Stack = createStackNavigator();

export const TutorialIslandSecureTodayTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={TutorialIslandRoutes.TUTORIAL_ISLAND_TODAY}
                component={TutorialIslandToday}
            />
        </Stack.Navigator>
    );
};

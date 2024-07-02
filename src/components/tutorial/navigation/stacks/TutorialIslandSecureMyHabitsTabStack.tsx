import { TutorialIslandRoutes } from 'src/navigation/RootStackParamList';
import { TutorialIslandManageHabits } from '../../TutorialIslandManageHabits';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const TutorialIslandSecureMyHabitsTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={TutorialIslandRoutes.TUTORIAL_ISLAND_MY_HABITS_TAB}
                component={TutorialIslandManageHabits}
            />
        </Stack.Navigator>
    );
};

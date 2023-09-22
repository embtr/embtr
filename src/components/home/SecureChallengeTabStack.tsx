import { ChallengeMain } from 'src/components/challenge/ChallengeMain';
import { ChallengeDetails } from '../common/timeline/challenges/ChallengeDetails';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { CreateUserPost } from '../timeline/CreateUserPost';
import { AddHabitCategory } from '../plan/planning/AddHabitCategory';

export const SecureChallengeTabStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="ChallengeMain" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ChallengeMain" component={ChallengeMain} />
            <Stack.Screen name="ChallengeDetails" component={ChallengeDetails} />
            <Stack.Screen
                name="CreateUserPost"
                component={CreateUserPost}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
        </Stack.Navigator>
    );
};

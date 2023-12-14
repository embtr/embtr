import { ChallengeMain } from 'src/components/challenge/ChallengeMain';
import { ChallengeDetails } from '../common/timeline/challenges/ChallengeDetails';
import { createStackNavigator } from '@react-navigation/stack';

export const SecureChallengeTabStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="ChallengeMain" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ChallengeMain" component={ChallengeMain} />
            <Stack.Screen name="ChallengeDetails" component={ChallengeDetails} />
        </Stack.Navigator>
    );
};

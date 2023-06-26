import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChallengeMain } from 'src/components/challenge/ChallengeMain';
import { ChallengeDetails } from '../common/timeline/challenges/ChallengeDetails';

export const SecureChallengeTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="ChallengeMain" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ChallengeMain" component={ChallengeMain} />
            <Stack.Screen name="ChallengeDetails" component={ChallengeDetails} />
        </Stack.Navigator>
    );
};

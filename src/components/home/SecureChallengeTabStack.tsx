import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlanMain } from 'src/components/plan/PlanMain';
import { DailyResultDetails } from '../common/timeline/DailyResultDetails';
import { UserProfile } from '../profile/UserProfile';
import { ChallengeMain } from 'src/components/challenge/ChallengeMain';

export const SecureChallengeTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="ChallengeMain" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ChallengeMain" component={ChallengeMain} />
        </Stack.Navigator>
    );
};

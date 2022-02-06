import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Explore } from 'src/components/explore/Explore';
import { UserProfile } from 'src/components/profile/UserProfile';
import { Comments } from 'src/components/common/timeline/comments/Comments';

const Stack = createNativeStackNavigator();

export const SecureExploreTab = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Explore" component={Explore} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="ChallengeComments" component={Comments} />
        </Stack.Navigator>
    );
};
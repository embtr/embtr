import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserSearch } from 'src/components/profile/search/UserSearch';
import { UserProfile } from 'src/components/profile/UserProfile';
import { Timeline } from 'src/components/timeline/Timeline';
import { CreateTimelineStory } from 'src/components/timeline/CreateTimelineStory';
import { Notifications } from 'src/components/notification/Notifications';
import { DailyResultDetails } from 'src/components/common/timeline/DailyResultDetails';
import { UserPostDetails } from 'src/components/common/timeline/UserPostDetails';
import { ChallengeDetails } from '../common/timeline/ChallengeDetails';

const Stack = createNativeStackNavigator();

export const SecureTimelineTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Timeline" component={Timeline} />
            <Stack.Screen name="CreateTimelineStory" component={CreateTimelineStory} />
            <Stack.Screen name="UserSearch" component={UserSearch} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="UserPostDetails" component={UserPostDetails} />
            <Stack.Screen name="ChallengeDetails" component={ChallengeDetails} />
            <Stack.Screen name="DailyResultDetails" component={DailyResultDetails} />
            <Stack.Screen name="Notifications" component={Notifications} />
        </Stack.Navigator>
    );
};

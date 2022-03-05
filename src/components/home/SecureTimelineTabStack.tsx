import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserSearch } from 'src/components/profile/search/UserSearch';
import { UserProfile } from 'src/components/profile/UserProfile';
import { Timeline } from 'src/components/timeline/Timeline';
import { CreateTimelineStory } from 'src/components/timeline/CreateTimelineStory';
import { TimelineComments } from 'src/components/common/timeline/TimelineComments';
import { ChallengeComments } from 'src/components/common/timeline/ChallengeComments';
import { Notifications } from 'src/components/notification/Notifications';

const Stack = createNativeStackNavigator();

export const SecureTimelineTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Timeline" component={Timeline} />
            <Stack.Screen name="CreateTimelineStory" component={CreateTimelineStory} />
            <Stack.Screen name="UserSearch" component={UserSearch} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="TimelineComments" component={TimelineComments} />
            <Stack.Screen name="ChallengeComments" component={ChallengeComments} />
            <Stack.Screen name="Notifications" component={Notifications} />
        </Stack.Navigator>
    );
};
import { UserProfile } from '../profile/UserProfile';
import { Today } from '../today/Today';
import { WidgetMarketplace } from '../widgets/marketplace/WidgetMarketplace';
import { AddQuoteOfTheDay } from '../widgets/quote_of_the_day/AddQuoteOfTheDay';
import { DailyResultDetails } from '../common/timeline/DailyResultDetails';
import { AddHabitCategory } from '../plan/planning/AddHabitCategory';
import { CreateUserPost } from '../timeline/CreateUserPost';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator();
export const SecureTodayTabStack = () => {
    return (
        <Stack.Navigator initialRouteName="Today" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Today" component={Today} />
            <Stack.Screen name="WidgetMarketplace" component={WidgetMarketplace} />
            <Stack.Screen name="AddQuoteOfTheDay" component={AddQuoteOfTheDay} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="DailyResultDetails" component={DailyResultDetails} />

            <Stack.Screen
                name="CreateUserPost"
                component={CreateUserPost}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
        </Stack.Navigator>
    );
};

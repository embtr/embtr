import { UserProfile } from '../profile/UserProfile';
import { Today } from '../today/Today';
import { WidgetMarketplace } from '../widgets/marketplace/WidgetMarketplace';
import { AddQuoteOfTheDay } from '../widgets/quote_of_the_day/AddQuoteOfTheDay';
import { DailyResultDetails } from '../common/timeline/DailyResultDetails';
import { AddTasks } from '../plan/planning/AddTasks';
import { CreateUserPost } from '../timeline/CreateUserPost';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

export const SecureTodayTabStack = () => {
    const Stack = createStackNavigator();

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
            <Stack.Screen
                name="AddTasks"
                component={AddTasks}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
        </Stack.Navigator>
    );
};

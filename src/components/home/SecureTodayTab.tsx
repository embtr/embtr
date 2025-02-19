import { UserProfile } from '../profile/UserProfile';
import { Today } from '../today/Today';
import { WidgetMarketplace } from '../widgets/marketplace/WidgetMarketplace';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
export const SecureTodayTabStack = () => {
    return (
        <Stack.Navigator initialRouteName="Today" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Today" component={Today} />
            <Stack.Screen name="WidgetMarketplace" component={WidgetMarketplace} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
        </Stack.Navigator>
    );
};

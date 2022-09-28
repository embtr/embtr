import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Today } from '../today/Today';

export const SecureTodayTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName='Today' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Today" component={Today} />
        </Stack.Navigator>
    );
};

import * as React from 'react';
import { Button, Text, TextStyle, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Screen } from 'src/components/common/screen';
import { useAppDispatch } from 'src/redux/hooks';
import { clearUser, setUser } from 'src/redux/user/UserSlice';

function HomeScreen() {
    const { colors } = useTheme();
    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    return (
        <Screen>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={textStyle}>Home!</Text>
            </View>
        </Screen>
    );
}

function ProfileScreen() {
    const { colors } = useTheme();
    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const dispatch = useAppDispatch();

    return (
        <Screen>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={textStyle}>Profile!</Text>
                <Button title='logout' onPress={() => {dispatch(clearUser());}}></Button>
            </View>
        </Screen>
    );
}

const Tab = createBottomTabNavigator();

export const Dashboard = () => {
    const { colors } = useTheme();

    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle:{backgroundColor: colors.background}} }>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
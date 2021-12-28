import * as React from 'react';
import { Button, Text, TextStyle, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Screen } from 'src/components/common/screen';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { clearUser, getUser } from 'src/redux/user/UserSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';

function HomeScreen() {
    const { colors } = useTheme();
    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    return (
        <Screen>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={textStyle}>welcome to the embtr. homepage!</Text>
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
    const user = useAppSelector(getUser);

    return (
        <Screen>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flex: 4 }} />

                <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{ uri: user.profileUrl }} />
                    <Text style={textStyle}>{user.firstName + " " + user.lastName}</Text>
                    <Text style={textStyle}>{user.email}</Text>
                </View>
                <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                    <Button title='logout' onPress={() => { dispatch(clearUser()); }}></Button>
                </View>
                <View style={{ flex: 4 }} />

            </View>
        </Screen>
    );
}

const Tab = createBottomTabNavigator();

export const Dashboard = () => {
    const { colors } = useTheme();
    const user = useAppSelector(getUser);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'Home') {
                        let iconName: string = focused ? 'ios-home' : 'ios-home-outline';
                        if (focused) {
                            return (
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Ionicons name={iconName} size={size} color={colors.primary} />
                                    <Text style={{ color: colors.primary }}>home</Text>
                                </View>
                            )
                        } else {
                            return (
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Ionicons name={iconName} size={size} color={colors.primary} />
                                    <Text style={{ color: colors.text }}>home</Text>
                                </View>
                            )
                        }
                    }

                    if (route.name === 'Profile') {
                        if (focused) {
                            return (
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <View style={{ width: size + 2, height: size + 2, borderRadius: 50, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
                                        <Image style={{ width: size, height: size, borderRadius: 50 }} source={{ uri: user.profileUrl }} />
                                    </View>
                                    <Text style={{ color: colors.primary }}>you</Text>
                                </View>
                            )
                        } else {
                            return (
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <View style={{ width: size + 2, height: size + 2, borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
                                        <Image style={{ width: size, height: size, borderRadius: 50 }} source={{ uri: user.profileUrl }} />
                                    </View>
                                    <Text style={{ color: colors.text }}>you</Text>
                                </View>
                            )
                        }
                    }
                },
                tabBarShowLabel: false,
                headerShown: false,
                tabBarActiveBackgroundColor: colors.background_secondary,
                tabBarInactiveBackgroundColor: colors.background
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
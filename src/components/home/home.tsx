import * as React from 'react';
import { Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useAppSelector } from 'src/redux/hooks';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from 'src/components/profile/UserProfle';
import { Timeline } from 'src/components/timeline/Timeline';
import { getUser } from 'src/redux/user/UserSlice';
import { isDesktopBrowser } from 'src/util/DeviceUtil';

const Tab = createBottomTabNavigator();

const TABS = {
    USER_PROFILE: "UserProfile",
    TIMELINE: "Timeline"
}

export const Dashboard = () => {
    const { colors } = useTheme();
    const user = useAppSelector(getUser);

    return (
        <View style={{ flex: 1, backgroundColor: "red", overflow: isDesktopBrowser() ? "hidden" : undefined }}>

            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarStyle: { backgroundColor: colors.background },
                    tabBarIcon: ({ focused, color, size }) => {
                        if (route.name === TABS.TIMELINE) {
                            let icon: any = focused ? 'ios-home' : 'ios-home-outline';
                            let color = focused ? colors.primary_border : colors.text;
                            return (
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Ionicons name={icon} size={size} color={color} />
                                    <Text style={{ color: color }}>timeline</Text>
                                </View>
                            )
                        }

                        if (route.name === TABS.USER_PROFILE) {
                            let textColor = focused ? colors.primary_border : colors.text;
                            let backgroundColor = focused ? colors.primary_border : undefined;
                            return (
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <View style={{ width: size + 2, height: size + 2, borderRadius: 50, backgroundColor: backgroundColor, alignItems: "center", justifyContent: "center" }}>
                                        <Image style={{ width: size, height: size, borderRadius: 50 }} source={{ uri: user.profileUrl }} />
                                    </View>
                                    <Text style={{ color: textColor }}>you</Text>
                                </View>
                            )
                        }
                    },
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarActiveBackgroundColor: colors.background_secondary,
                    tabBarInactiveBackgroundColor: colors.background,
                })}
            >
                <Tab.Screen name={TABS.TIMELINE} component={Timeline} />
                <Tab.Screen name={TABS.USER_PROFILE} component={UserProfile} />
            </Tab.Navigator>
        </View>
    );
}
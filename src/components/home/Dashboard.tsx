import * as React from 'react';
import { Text, View, Image, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import ProfileController from 'src/controller/profile/ProfileController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTab } from 'src/components/navigation/TimelineTab';
import { ProfileTab } from 'src/components/navigation/ProfileTab';
import { useLinkTo } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TABS = {
    USER_PROFILE: "CurrentUserTab",
    TIMELINE: "TimelineTab"
}

export const Dashboard = () => {
    const { colors } = useTheme();

    const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(undefined);
    React.useEffect(() => {
        getCurrentUserUid(setCurrentUserId);
    }, []);

    const [userProfilePhoto, setUserProfilePhoto] = React.useState<string | undefined>(undefined);
    if (currentUserId) {
        ProfileController.getProfile(currentUserId, (profileData: UserProfileModel) => { setUserProfilePhoto(profileData?.photoUrl ? profileData?.photoUrl : undefined) });
    }

    const changeLinkTo = useLinkTo();
    React.useEffect(() => {
        Linking.getInitialURL().then(result => {
            if (result) {
                const splitUrl = result.split(/[\s/]+/)
                const endpoint = "/" + splitUrl[splitUrl.length - 1]

                if (endpoint !== "/") {
                    try { changeLinkTo(endpoint); } catch (e) { }
                }
            }
        });
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "red", overflow: isDesktopBrowser() ? "hidden" : undefined }}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarStyle: { backgroundColor: colors.background },
                    tabBarIcon: ({ focused, size }) => {
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
                                        <Image style={{ width: size, height: size, borderRadius: 50 }} source={{ uri: userProfilePhoto }} />
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
                <Tab.Screen name={TABS.TIMELINE} component={TimelineTab} />
                <Tab.Screen name={TABS.USER_PROFILE} component={ProfileTab} />
            </Tab.Navigator>
        </View>
    );
}
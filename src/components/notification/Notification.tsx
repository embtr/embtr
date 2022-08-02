import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { NotificationModel } from 'src/controller/notification/NotificationController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { TouchableOpacity } from 'react-native';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { formatDistance } from 'date-fns';

interface Props {
    notification: NotificationModel
}

export const Notification = ({ notification }: Props) => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const [notifier, setNotifier] = React.useState<UserProfileModel>();

    useFocusEffect(
        React.useCallback(() => {
            ProfileController.getProfile(notification.notifier_uid, setNotifier);
        }, [])
    );

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_400Regular,
        Poppins_500Medium
    });

    if (!fontsLoaded) {
        return <View />
    }

    const time = formatDistance(notification.added.toDate(), new Date(), { addSuffix: true });

    return (
        <TouchableOpacity onPress={() => { navigation.navigate(notification.target_page as keyof TimelineTabScreens, { id: notification.target_uid }) }} >
            <View style={{ width: "100%", alignContent: "center", alignItems: "center" }}>
                <View style={{ backgroundColor: colors.card_background_active, width: "95%", borderRadius: 15 }}>
                    <View style={{ flex: 1, flexDirection: "row", paddingTop: TIMELINE_CARD_PADDING, paddingBottom: TIMELINE_CARD_PADDING, paddingLeft: TIMELINE_CARD_PADDING }}>
                        <View>
                            {notifier && <View style={{ marginRight: 10 }}><NavigatableUserImage userProfileModel={notifier} size={35} /></View>}
                        </View>

                        <View style={{ paddingLeft: 10, flex: 1, alignSelf: 'stretch' }}>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                                    <Text style={{ fontFamily: "Poppins_600SemiBold", color: colors.timeline_card_header }}>{notifier?.name}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", paddingRight: TIMELINE_CARD_PADDING }}>
                                    <View style={{ padding: 2, borderWidth: 1, borderRadius: 50, borderColor: notification.read ? colors.card_background_active : colors.notification_dot, backgroundColor: notification.read ? colors.card_background_active : colors.notification_dot }} />
                                </View>
                            </View>

                            <View style={{ flex: 1, justifyContent: "flex-start", paddingLeft: 1 }}>
                                <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 10, color: colors.timeline_card_header }}>{notification.summary}</Text>
                            </View>

                            <View style={{paddingTop: 10}}>
                                <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 10, color: colors.timeline_card_header }}>{time}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
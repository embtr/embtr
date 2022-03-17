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
import { TouchableOpacity } from 'react-native-gesture-handler';

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

    return (
        <TouchableOpacity onPress={() => { navigation.navigate(notification.target_page as keyof TimelineTabScreens, { id: notification.target_uid }) }} >
            <View style={{ backgroundColor: colors.card_background }}>
                <View style={{ height: "auto", paddingTop: 5, paddingBottom: 5 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 10, paddingBottom: 10 }}>
                        <View style={{ marginLeft: 5, marginRight: 10 }}>
                            {!notification.read && <View style={{ padding: 2, borderWidth: 1, borderRadius: 50, borderColor: colors.primary_border, backgroundColor: colors.primary_border }} />}
                        </View>

                        {notifier && <View style={{ marginRight: 10 }}><NavigatableUserImage userProfileModel={notifier} size={35} /></View>}

                        <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 10, paddingBottom: 10, flex: 1 }}>
                            <Text style={{ color: colors.text, paddingTop: 15, paddingBottom: 15 }}>
                                {notifier?.name} {notification.summary}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
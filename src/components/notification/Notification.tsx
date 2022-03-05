import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { NotificationModel } from 'src/controller/notification/NotificationController';

interface Props {
    notification: NotificationModel
}

export const Notification = ({ notification }: Props) => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    return (
        <View style={{ backgroundColor: colors.card_background }}>
            <View style={{ height: "auto", paddingTop: 5, paddingBottom: 5 }}>
                <View style={{ padding: 5 }}>
                    <Text style={{ color: colors.text, textAlign: "center" }}>
                        {notification.summary}
                    </Text>
                </View>
            </View>
        </View>
    );
};
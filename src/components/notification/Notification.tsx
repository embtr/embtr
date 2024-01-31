import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { TouchableOpacity } from 'react-native';
import { POPPINS_SEMI_BOLD, PADDING_LARGE } from 'src/util/constants';
import { formatDistance } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { Notification as NotificationModel, NotificationTargetPage } from 'resources/schema';
import { CachedImage } from '../common/images/CachedImage';

interface Props {
    notification: NotificationModel;
}

export const Notification = ({ notification }: Props) => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const time = formatDistance(notification.createdAt ?? new Date(), new Date(), {
        addSuffix: true,
    });

    const params = {
        id: notification.targetId,
        uid: notification.fromUser?.uid,
        source: 'timeline',
    };

    const getTargetPage = (target: NotificationTargetPage) => {
        switch (target) {
            case NotificationTargetPage.PLANNED_DAY_RESULT:
                return 'DailyResultDetails';
            case NotificationTargetPage.USER_POST_DETAILS:
                return 'UserPostDetails';
            case NotificationTargetPage.TODAY:
                return 'Today';
        }
    };

    return (
        <TouchableOpacity
            onPress={() => {
                if (!notification.targetPage) {
                    return;
                }

                const target = getTargetPage(notification.targetPage);
                navigation.navigate(target as keyof TimelineTabScreens, { ...params });
            }}
        >
            <View style={{ width: '100%', alignContent: 'center', alignItems: 'center' }}>
                <View
                    style={{
                        backgroundColor: colors.card_background,
                        width: '95%',
                        borderRadius: 15,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            paddingTop: PADDING_LARGE,
                            paddingBottom: PADDING_LARGE,
                            paddingLeft: PADDING_LARGE,
                        }}
                    >
                        <View style={{ marginRight: 10 }}>
                            <CachedImage
                                uri={notification.fromUser?.photoUrl!}
                                style={{ width: 35, height: 35, borderRadius: 50 }}
                            />
                        </View>

                        <View style={{ paddingLeft: 10, flex: 1, alignSelf: 'stretch' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                    <Text
                                        style={{
                                            fontFamily: POPPINS_SEMI_BOLD,
                                            color: colors.timeline_card_header,
                                        }}
                                    >
                                        {notification.fromUser?.displayName}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'flex-end',
                                        paddingRight: PADDING_LARGE,
                                    }}
                                >
                                    <Ionicons
                                        name={'mail-outline'}
                                        size={16}
                                        color={
                                            notification.read
                                                ? colors.card_background
                                                : colors.notification_dot
                                        }
                                    />
                                </View>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'flex-start', paddingLeft: 1 }}>
                                <Text
                                    style={{
                                        fontFamily: 'Poppins_400Regular',
                                        fontSize: 10,
                                        color: colors.timeline_card_header,
                                    }}
                                >
                                    {notification.summary}
                                </Text>
                            </View>

                            <View style={{ paddingTop: 10 }}>
                                <Text
                                    style={{
                                        fontFamily: 'Poppins_400Regular',
                                        fontSize: 10,
                                        color: colors.timeline_card_header,
                                    }}
                                >
                                    {time}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

import * as React from 'react';
import { View, Text } from 'react-native';
import { TabView, TabBar, SceneRendererProps } from 'react-native-tab-view';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Banner } from '../common/Banner';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_MEDIUM } from 'src/util/constants';
import { Screen } from '../common/Screen';
import { Ionicons } from '@expo/vector-icons';
import { Timeline } from './Timeline';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import {
    NotificationController,
    NotificationCustomHooks,
} from 'src/controller/notification/NotificationController';
import { Leaderboard } from '../leaderboard/Leaderboard';

export const HomeTab = () => {
    const { colors } = useTheme();
    const [index, setIndex] = React.useState(0);

    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();
    const unreadNotificationCount = NotificationCustomHooks.useUnreadNotificationCount();

    useFocusEffect(
        React.useCallback(() => {
            NotificationController.prefetchUnreadNotificationCount();
        }, [])
    );

    const renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
        switch (props.route.key) {
            case 'Timeline':
                return (
                    <View style={{ height: '100%', paddingVertical: PADDING_LARGE }}>
                        <Timeline />
                    </View>
                );

            case 'Leaderboard':
                return (
                    <View style={{ height: '100%' }}>
                        <Leaderboard />
                    </View>
                );
        }

        return <View />;
    };

    const indexChanged = (index: number) => {
        setIndex(index);
    };

    const [routes] = React.useState([
        { key: 'Timeline', title: 'Timeline' },
        { key: 'Leaderboard', title: 'Leaderboard' },
    ]);

    return (
        <Screen>
            <View style={{ height: '100%' }}>
                <Banner
                    name={'Social'}
                    leftIcon={'people-outline'}
                    leftRoute={'UserSearch'}
                    innerLeftIcon={'add-outline'}
                    innerLeftOnClick={() => {
                        navigation.navigate('CreateUserPost');
                    }}
                    rightIcon={'notifications-outline'}
                    rightRoute={'Notifications'}
                    rightIconNotificationCount={unreadNotificationCount.data ?? 0}
                    innerRightPoints={true}
                />

                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={indexChanged}
                    swipeEnabled={false}
                    renderTabBar={(props: any) => (
                        <View>
                            <TabBar
                                {...props}
                                indicatorStyle={{
                                    height: 4,
                                    borderRadius: 15,
                                    backgroundColor: colors.accent_color,
                                }}
                                renderLabel={({ focused, route }) => {
                                    return (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {route.title === 'Challenges' && (
                                                <View
                                                    style={{
                                                        bottom: 2,
                                                        paddingRight: PADDING_SMALL / 2,
                                                        opacity: focused ? 1.0 : 0.35,
                                                    }}
                                                >
                                                    <Ionicons
                                                        name={'flash'}
                                                        size={12}
                                                        color={colors.secondary_accent_color}
                                                    />
                                                </View>
                                            )}
                                            <Text
                                                style={{
                                                    fontSize: 13,
                                                    color: colors.planning_focused_text,
                                                    fontFamily: POPPINS_MEDIUM,
                                                    opacity: focused ? 1.0 : 0.35,
                                                }}
                                            >
                                                {route.title}
                                            </Text>
                                        </View>
                                    );
                                }}
                                style={{
                                    backgroundColor: colors.background,
                                    width: '94%',
                                    marginLeft: '3%',
                                    shadowOffset: { height: 0, width: 0 },
                                    shadowColor: 'transparent',
                                    shadowOpacity: 0,
                                    elevation: 0,
                                }}
                                indicatorContainerStyle={{
                                    backgroundColor: colors.scroll_tab_background,
                                    height: 4,
                                    marginTop: 43,
                                    borderRadius: 15,
                                }}
                            />
                        </View>
                    )}
                />
            </View>
        </Screen>
    );
};

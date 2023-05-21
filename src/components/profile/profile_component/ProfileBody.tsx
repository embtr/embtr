import * as React from 'react';
import { View, Text, NativeScrollEvent, ScrollView } from 'react-native';
import { TabView, TabBar, SceneRendererProps } from 'react-native-tab-view';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TodayTabRoute } from 'src/components/profile/profile_component/profile_tabs/TodayTabRoute';
import { Screen } from 'src/components/common/Screen';
import { ScrollChangeEvent } from 'src/util/constants';
import { ProfileTabRoute } from './profile_tabs/ProfileTabRoute';
import { RefreshControl } from 'react-native-gesture-handler';
import { User } from 'resources/schema';
import { UserActivityTabRoute } from './profile_tabs/UserActivityTabRoute';

/*
 * Avoid rerenders
 * https://github.com/satya164/react-native-tab-view#avoid-unnecessary-re-renders
 */
interface Props {
    newUser: User;
    onRefresh: Function;
    isRefreshing: boolean;
    refreshedTimestamp: Date;
    onShouldExpand: Function;
}

export const ProfileBody = ({
    newUser,
    onRefresh,
    isRefreshing,
    refreshedTimestamp,
    onShouldExpand,
}: Props) => {
    const { colors } = useTheme();
    const [index, setIndex] = React.useState(0);

    const shouldExpand = ({
        layoutMeasurement,
        contentOffset,
        contentSize,
    }: NativeScrollEvent): ScrollChangeEvent => {
        if (contentOffset.y < 0) {
            return ScrollChangeEvent.BEYOND_TOP;
        }

        if (contentOffset.y == 0) {
            return ScrollChangeEvent.AT_TOP;
        }

        return ScrollChangeEvent.BELOW_TOP;
    };

    const renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
        switch (props.route.key) {
            case 'profile':
                return (
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => {
                                    onRefresh();
                                }}
                            />
                        }
                        scrollEventThrottle={8}
                        onScroll={({ nativeEvent }) => {
                            onShouldExpand(shouldExpand(nativeEvent));
                        }}
                    >
                        <ProfileTabRoute newUser={newUser} />
                    </ScrollView>
                );

            case 'today':
                return (
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => {
                                    onRefresh();
                                }}
                            />
                        }
                        scrollEventThrottle={8}
                        onScroll={({ nativeEvent }) => {
                            onShouldExpand(shouldExpand(nativeEvent));
                        }}
                    >
                        <TodayTabRoute user={newUser} />
                    </ScrollView>
                );

            case 'activity':
                return (
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => {
                                    onRefresh();
                                }}
                            />
                        }
                        scrollEventThrottle={8}
                        onScroll={({ nativeEvent }) => {
                            onShouldExpand(shouldExpand(nativeEvent));
                        }}
                    >
                        <UserActivityTabRoute user={newUser} />
                    </ScrollView>
                );
        }

        return <View />;
    };

    const indexChanged = (index: number) => {
        setIndex(index);
    };

    const [routes] = React.useState([
        { key: 'profile', title: 'Profile' },
        { key: 'today', title: 'Today' },
        { key: 'activity', title: 'Activity' },
    ]);

    return (
        <Screen>
            <View style={{ height: '100%' }}>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={indexChanged}
                    renderTabBar={(props) => (
                        <TabBar
                            {...props}
                            indicatorStyle={{
                                height: 4,
                                borderRadius: 15,
                                backgroundColor: colors.planning_horizontal_indicator,
                            }}
                            renderLabel={({ focused, route }) => {
                                return (
                                    <Text
                                        style={{
                                            color: colors.planning_focused_text,
                                            fontFamily: 'Poppins_600SemiBold',
                                            opacity: focused ? 1.0 : 0.35,
                                        }}
                                    >
                                        {route.title}
                                    </Text>
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
                    )}
                />
            </View>
        </Screen>
    );
};

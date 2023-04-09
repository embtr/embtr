import * as React from 'react';
import { View, Text, NativeScrollEvent, ScrollView } from 'react-native';
import { TabView, TabBar, SceneRendererProps } from 'react-native-tab-view';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TodayTabRoute } from 'src/components/profile/profile_component/profile_tabs/TodayTabRoute';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import { PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';
import { Screen } from 'src/components/common/Screen';
import { ScrollChangeEvent } from 'src/util/constants';
import UserController, { UserModel } from 'src/controller/user/UserController';
import { ProfileTabRoute } from './profile_tabs/ProfileTabRoute';
import { ActivityTabRoute } from './profile_tabs/ActivityTabRoute';
import { RefreshControl } from 'react-native-gesture-handler';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import AccessLogController from 'src/controller/access_log/AccessLogController';
import { User } from 'resources/schema';

/*
 * Avoid rerenders
 * https://github.com/satya164/react-native-tab-view#avoid-unnecessary-re-renders
 */
interface Props {
    plannedDay: PlannedDay;
    user: UserModel;
    userProfileModel: UserProfileModel;
    newUser: User;
    onRefresh: Function;
    isRefreshing: boolean;
    refreshedTimestamp: Date;
    onShouldExpand: Function;
}

export const ProfileBody = ({ plannedDay, user, userProfileModel, newUser, onRefresh, isRefreshing, refreshedTimestamp, onShouldExpand }: Props) => {
    const { colors } = useTheme();
    const [history, setHistory] = React.useState<string[]>([]);
    const [goals, setGoals] = React.useState<GoalModel[]>([]);
    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        logAccessLog(index);
    }, [index]);

    const logAccessLog = (index: number) => {
        switch (index) {
            case 0:
                AccessLogController.addProfileActivityPageAccesLog();
                break;

            case 1:
                AccessLogController.addProfileTodayPageAccesLog();
                break;

            case 2:
                AccessLogController.addProfileActivityPageAccesLog();
                break;
        }
    };

    const shouldExpand = ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent): ScrollChangeEvent => {
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
                        <ProfileTabRoute newUser={newUser} user={user} userProfileModel={userProfileModel} history={history} goals={goals} pillars={pillars} />
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
                        <TodayTabRoute plannedDay={plannedDay} />
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
                        <ActivityTabRoute refreshedTimestamp={refreshedTimestamp} user={user} userProfile={userProfileModel} />
                    </ScrollView>
                );
        }

        return <View />;
    };

    React.useEffect(() => {
        fetch();
    }, [refreshedTimestamp]);

    React.useEffect(() => {
        fetch();
    }, [refreshedTimestamp]);

    const fetch = async () => {
        const history = await DailyResultController.getDailyResultHistory(userProfileModel.uid!);
        setHistory(history);

        GoalController.getGoals(userProfileModel.uid!, (goals: GoalModel[]) => {
            goals = goals.reverse();
            setGoals(goals);
        });

        fetchPillars();
    };

    const fetchPillars = async () => {
        if (userProfileModel.uid) {
            const user = await UserController.get(userProfileModel.uid);
            const pillars = await PillarController.getPillars(user);
            setPillars(pillars);
        }
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
                            indicatorStyle={{ height: 4, borderRadius: 15, backgroundColor: colors.planning_horizontal_indicator }}
                            renderLabel={({ focused, route }) => {
                                return (
                                    <Text style={{ color: colors.planning_focused_text, fontFamily: 'Poppins_600SemiBold', opacity: focused ? 1.0 : 0.35 }}>
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
                            indicatorContainerStyle={{ backgroundColor: colors.scroll_tab_background, height: 4, marginTop: 43, borderRadius: 15 }}
                        />
                    )}
                />
            </View>
        </Screen>
    );
};

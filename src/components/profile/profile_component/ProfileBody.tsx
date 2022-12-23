import * as React from 'react';
import { View, Text, NativeScrollEvent, ScrollView } from 'react-native';
import { TabView, TabBar, SceneRendererProps } from 'react-native-tab-view';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useTheme } from 'src/components/theme/ThemeProvider';
import PillarsTabRoute from 'src/components/profile/profile_component/profile_tabs/PillarsTabRoute';
import { TodayTabRoute } from 'src/components/profile/profile_component/profile_tabs/TodayTabRoute';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { ActivityTabRoute } from './profile_tabs/ActivityTabRoute';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import PlannedDayController, { getTodayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';
import { PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';
import { Screen } from 'src/components/common/Screen';
import { ScrollChangeEvent } from 'src/util/constants';
import UserController from 'src/controller/user/UserController';

/*
 * Avoid rerenders
 * https://github.com/satya164/react-native-tab-view#avoid-unnecessary-re-renders
 */
interface Props {
    userProfileModel: UserProfileModel;
    refreshedTimestamp: Date;
    onShouldExpand: Function;
    isPillarTab: Function;
}

export const ProfileBody = ({ userProfileModel, refreshedTimestamp, onShouldExpand, isPillarTab }: Props) => {
    const { colors } = useTheme();
    const [history, setHistory] = React.useState<string[]>([]);
    const [goals, setGoals] = React.useState<GoalModel[]>([]);
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();
    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    const [index, setIndex] = React.useState(0);

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
                        scrollEventThrottle={8}
                        onScroll={({ nativeEvent }) => {
                            onShouldExpand(shouldExpand(nativeEvent));
                        }}
                    >
                        <ActivityTabRoute userProfileModel={userProfileModel} history={history} goals={goals} pillars={pillars} />
                    </ScrollView>
                );

            case 'today':
                if (!plannedDay) {
                    return <View />;
                }

                return (
                    <ScrollView
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
                        scrollEventThrottle={8}
                        onScroll={({ nativeEvent }) => {
                            onShouldExpand(shouldExpand(nativeEvent));
                        }}
                    >
                        <ActivityTabRoute userProfileModel={userProfileModel} history={history} goals={goals} pillars={pillars} />
                    </ScrollView>
                );
        }

        return <View></View>;
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

        if (userProfileModel.uid) {
            const user = await UserController.get(userProfileModel.uid);
            const plannedDay = await PlannedDayController.get(user, getTodayKey());
            setPlannedDay(plannedDay);
        }
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
        isPillarTab(index === 2);
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

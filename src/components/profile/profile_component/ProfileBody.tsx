import * as React from 'react';
import { View, Text } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useTheme } from 'src/components/theme/ThemeProvider';
import PillarsTabRoute from 'src/components/profile/profile_component/profile_tabs/PillarsTabRoute';
import { TodayTabRoute } from 'src/components/profile/profile_component/profile_tabs/TodayTabRoute';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { ActivityTabRoute } from './profile_tabs/ActivityTabRoute';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import PlannedDayController, { getTodayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';

/*
 * Avoid rerenders
 * https://github.com/satya164/react-native-tab-view#avoid-unnecessary-re-renders
 */
interface Props {
    userProfileModel: UserProfileModel;
    refreshedTimestamp: Date;
}

export const ProfileBody = ({ userProfileModel, refreshedTimestamp }: Props) => {
    const { colors } = useTheme();

    const [index, setIndex] = React.useState(0);

    const [history, setHistory] = React.useState<string[]>([]);
    const [goals, setGoals] = React.useState<GoalModel[]>([]);
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();

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

        PlannedDayController.get(userProfileModel.uid!, getTodayKey(), setPlannedDay);
    };

    const activityRoute = () => {
        if (index !== 0) {
            return <View />;
        }

        return <ActivityTabRoute userProfileModel={userProfileModel} history={history} goals={goals} />;
    };

    const todayRoute = () => {
        if (index !== 1 || !plannedDay) {
            return <View />;
        }

        return <TodayTabRoute plannedDay={plannedDay} />;
    };

    const pillarsRoute = () => {
        if (index !== 2) {
            return <View />;
        }

        return <PillarsTabRoute userProfileModel={userProfileModel} />;
    };

    const [routes] = React.useState([
        { key: 'activity', title: 'Activity' },
        { key: 'today', title: 'Today' },
        { key: 'pillars', title: 'Pillars' },
    ]);

    const renderScene = SceneMap({
        activity: activityRoute,
        today: todayRoute,
        pillars: pillarsRoute,
    });

    return (
        <View style={{ width: '100%' }}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ height: 4, borderRadius: 0, backgroundColor: colors.planning_horizontal_indicator }}
                        renderLabel={({ focused, route }) => {
                            return (
                                <Text style={{ color: colors.planning_focused_text, fontFamily: 'Poppins_600SemiBold', opacity: focused ? 1.0 : 0.35 }}>
                                    {route.title}
                                </Text>
                            );
                        }}
                        style={{
                            backgroundColor: colors.background,
                            width: '95%',
                            marginLeft: '2.5%',
                            shadowOffset: { height: 0, width: 0 },
                            shadowColor: 'transparent',
                            shadowOpacity: 0,
                            elevation: 0,
                        }}
                        indicatorContainerStyle={{ backgroundColor: colors.scroll_tab_background, height: 4, marginTop: 43 }}
                    />
                )}
            />
        </View>
    );
};

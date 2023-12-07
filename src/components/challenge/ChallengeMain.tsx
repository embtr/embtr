import * as React from 'react';
import { View, Text } from 'react-native';
import { TabView, TabBar, SceneRendererProps } from 'react-native-tab-view';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Banner } from '../common/Banner';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { UpcomingChallenges } from './UpcomingChallenges';
import { Screen } from '../common/Screen';
import { PlanningWidgetImproved } from '../widgets/planning/PlanningWidgetImproved';

export const ChallengeMain = () => {
    const { colors } = useTheme();
    const [index, setIndex] = React.useState(0);

    const renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
        switch (props.route.key) {
            case 'planning':
                return (
                    <View style={{ height: '100%', padding: TIMELINE_CARD_PADDING / 2 }}>
                        <PlanningWidgetImproved />
                    </View>
                );

            case 'challenges':
                return (
                    <View style={{ height: '100%' }}>
                        <UpcomingChallenges />
                    </View>
                );

            case 'achievements':
                return (
                    <View
                        style={{
                            height: '100%',
                            width: '100%',
                            alignContent: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                color: colors.text,
                                fontFamily: POPPINS_REGULAR,
                            }}
                        >
                            Coming Soon!
                        </Text>
                    </View>
                );
        }

        return <View />;
    };

    const indexChanged = (index: number) => {
        setIndex(index);
    };

    const [routes] = React.useState([
        { key: 'planning', title: 'Planning' },
        { key: 'challenges', title: 'Challenges' },
        { key: 'achievements', title: 'Achievements' },
    ]);

    return (
        <Screen>
            <View style={{ height: '100%', backgroundColor: '10' }}>
                <Banner name="Habit Journey" />
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={indexChanged}
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

import * as React from 'react';
import { View, Text } from 'react-native';
import { TabView, TabBar, SceneRendererProps } from 'react-native-tab-view';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Screen } from 'src/components/common/Screen';
import { Banner } from '../common/Banner';
import { POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { UpcomingChallenges } from './UpcomingChallenges';
import { Journey } from '../journey/Journey';

export const ChallengeMain = () => {
    const { colors } = useTheme();
    const [index, setIndex] = React.useState(0);

    const [height, setHeight] = React.useState(0);
    const [pageLoaded, setPageLoaded] = React.useState(false);
    const [profileHeight, setProfileHeight] = React.useState(0);
    const [todayHeight, setTodayHeight] = React.useState(0);
    const [activityHeight, setActivityHeight] = React.useState(0);

    const renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
        switch (props.route.key) {
            case 'journey':
                return (
                    <View style={{ height: '100%' }}>
                        <Journey />
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

    React.useEffect(() => {
        setPageLoaded(true);
        setHeight(profileHeight);
    }, [profileHeight]);

    const indexChanged = (index: number) => {
        setIndex(index);

        if (pageLoaded) {
            if (index === 0) {
                setHeight(profileHeight);
            } else if (index === 1) {
                setHeight(todayHeight);
            } else if (index === 2) {
                setHeight(activityHeight);
            }
        }
    };

    const [routes] = React.useState([
        { key: 'journey', title: 'Journey' },
        { key: 'challenges', title: 'Challenges' },
        { key: 'achievements', title: 'Achievements' },
    ]);

    const handleTabLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
    };

    return (
        <Screen>
            <View style={{ height: '100%', backgroundColor: '10' }}>
                <Banner name="Habit Journey" />
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={indexChanged}
                    renderTabBar={(props) => (
                        <View onLayout={handleTabLayout}>
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

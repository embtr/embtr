import * as React from 'react';
import { View, Text } from 'react-native';
import { TabView, TabBar, SceneRendererProps } from 'react-native-tab-view';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TodayTabRoute } from 'src/components/profile/profile_component/profile_tabs/TodayTabRoute';
import { Screen } from 'src/components/common/Screen';
import { ProfileTabRoute } from './profile_tabs/ProfileTabRoute';
import { User } from 'resources/schema';
import { UserActivityTabRoute } from './profile_tabs/UserActivityTabRoute';

/*
 * Avoid rerenders
 * https://github.com/satya164/react-native-tab-view#avoid-unnecessary-re-renders
 */
interface Props {
    newUser: User;
    setHeight: Function;
}

export const ProfileBody = ({ newUser, setHeight }: Props) => {
    const { colors } = useTheme();
    const [index, setIndex] = React.useState(0);

    const [pageLoaded, setPageLoaded] = React.useState(false);
    const [profileHeight, setProfileHeight] = React.useState(0);
    const [todayHeight, setTodayHeight] = React.useState(0);
    const [activityHeight, setActivityHeight] = React.useState(0);

    const renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
        switch (props.route.key) {
            case 'profile':
                return <ProfileTabRoute newUser={newUser} setHeight={setProfileHeight} />;

            case 'today':
                return <TodayTabRoute user={newUser} setHeight={setTodayHeight} />;

            case 'activity':
                return <UserActivityTabRoute user={newUser} setHeight={setActivityHeight} />;
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
        { key: 'profile', title: 'Profile' },
        { key: 'today', title: 'Today' },
        { key: 'activity', title: 'Activity' },
    ]);

    const handleTabLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
    };

    return (
        <Screen>
            <View style={{ height: '100%' }}>
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
                        </View>
                    )}
                />
            </View>
        </Screen>
    );
};

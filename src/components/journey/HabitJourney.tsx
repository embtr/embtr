import * as React from 'react';
import { View, Text } from 'react-native';
import { TabView, TabBar, SceneRendererProps } from 'react-native-tab-view';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Banner } from '../common/Banner';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { Screen } from '../common/Screen';
import { UpcomingChallenges } from '../challenge/UpcomingChallenges';
import { Journey } from './Journey';
import { Ionicons } from '@expo/vector-icons';
import { UpcomingChallenges2 } from '../challenge/UpcomingChallenges2';

export const HabitJourney = () => {
    const { colors } = useTheme();
    const [index, setIndex] = React.useState(0);

    const renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
        switch (props.route.key) {
            case 'My Journey':
                return (
                    <View style={{ height: '100%', paddingVertical: PADDING_LARGE }}>
                        <Journey />
                    </View>
                );

            case 'Challenges':
                return (
                    <View style={{ height: '100%' }}>
                        <UpcomingChallenges2 />
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
        { key: 'My Journey', title: 'My Journey' },
        { key: 'Challenges', title: 'Challenges' },
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

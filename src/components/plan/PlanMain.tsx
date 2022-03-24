import React from 'react';
import { View, Text } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { SceneRendererProps, TabView, TabBar } from 'react-native-tab-view';
import { Banner } from 'src/components/common/Banner';
import { Planning } from 'src/components/plan/Planning';

/*
 * Avoid rerenders
 * https://github.com/satya164/react-native-tab-view#avoid-unnecessary-re-renders
*/

export const PlanMain = () => {
    const { colors } = useTheme();

    const renderScene = (props: SceneRendererProps & { route: { key: string; title: string; }; }) => {
        switch (props.route.key) {
            case 'tomorrow':
                return <View><Text style={{ color: colors.text }}>⚠️ tomorrow tab - coming soon!</Text></View>

            case 'routines':
                return <Planning />

            case 'pillars':
                return <View><Text style={{ color: colors.text }}>pillars tab</Text></View>
        }

        return <View></View>
    };

    const [index, setIndex] = React.useState(0);

    const [routes] = React.useState([
        { key: 'tomorrow', title: 'Tomorrow' },
        { key: 'routines', title: 'Routines' },
        { key: 'pillars', title: 'Pillars' },
    ]);

    return (
        <Screen>
            <Banner name={"Planning"} />

            <View style={{ height: "100%" }}>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}

                    renderTabBar={props => <TabBar {...props}
                        indicatorStyle={{ backgroundColor: colors.primary_border }}
                        renderLabel={({ focused, route }) => {
                            return (
                                <Text style={{ color: colors.text }}>
                                    {route.title}
                                </Text>
                            );
                        }}
                        style={{ backgroundColor: 'black' }} />
                    }
                />
            </View>
        </Screen>
    )
};
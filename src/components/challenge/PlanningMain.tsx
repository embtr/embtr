import * as React from 'react';
import { View, Text } from 'react-native';
import { TabView, TabBar, SceneRendererProps } from 'react-native-tab-view';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Banner } from '../common/Banner';
import { POPPINS_MEDIUM, POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';
import { Screen } from '../common/Screen';
import { PlanningWidgetImproved } from '../widgets/planning/PlanningWidgetImproved';
import { ScrollView } from 'react-native-gesture-handler';

export const PlanningMain = () => {
    return (
        <Screen>
            <Banner name="Planning" />

            <ScrollView>
                <View style={{ paddingHorizontal: PADDING_LARGE / 2 }}>
                    <PlanningWidgetImproved />
                </View>
            </ScrollView>
        </Screen>
    );
};

/*

// THIS IS SAVING THE TOP TAB LOGIC FOR LATER
    const { colors } = useTheme();

    const [index, setIndex] = React.useState(0);

    const renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
        switch (props.route.key) {
            case 'planning':
                return (
                    <View style={{ height: '100%', padding: PADDING_LARGE / 2 }}>
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

 */

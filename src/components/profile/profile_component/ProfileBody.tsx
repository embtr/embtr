import * as React from 'react';
import { View, Text } from 'react-native';
import { TabView, TabBar, SceneRendererProps } from 'react-native-tab-view';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useTheme } from 'src/components/theme/ThemeProvider';
import PillarsTabRoute from 'src/components/profile/profile_component/profile_tabs/PillarsTabRoute';
import { ActivityTabRoute } from 'src/components/profile/profile_component/profile_tabs/ActivityTabRoute';
import { TodayTabRoute } from 'src/components/profile/profile_component/profile_tabs/TodayTabRoute';

/*
 * Avoid rerenders
 * https://github.com/satya164/react-native-tab-view#avoid-unnecessary-re-renders
*/
interface Props {
    userProfileModel: UserProfileModel
}

export const ProfileBody = ({ userProfileModel }: Props) => {
    const { colors } = useTheme();

    const renderScene = (props: SceneRendererProps & { route: { key: string; title: string; }; }) => {
        switch (props.route.key) {
            case 'activity':
                return <ActivityTabRoute userProfileModel={userProfileModel} />

            case 'today':
                return <TodayTabRoute userProfileModel={userProfileModel} />

            case 'pillars':
                return <PillarsTabRoute userProfileModel={userProfileModel} />
        }

        return <View></View>
    };

    const [index, setIndex] = React.useState(0);

    const [routes] = React.useState([
        { key: 'activity', title: 'Activity' },
        { key: 'today', title: 'Today' },
        { key: 'pillars', title: 'Pillars' },
    ]);

    return (
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
                    style={{ backgroundColor: colors.background_medium }} />
                }
            />
        </View>
    )
}

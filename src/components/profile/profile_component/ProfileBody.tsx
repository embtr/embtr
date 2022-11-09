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
    userProfileModel: UserProfileModel;
    refreshedTimestamp: Date;
}

export const ProfileBody = ({ userProfileModel, refreshedTimestamp }: Props) => {
    const { colors } = useTheme();

    const [index, setIndex] = React.useState(0);

    const renderScene = (props: SceneRendererProps & { route: { key: string; title: string } }) => {
        switch (props.route.key) {
            case 'activity':
                return (
                    <View style={index !== 0 && { display: 'none' }}>
                        <ActivityTabRoute userProfileModel={userProfileModel} refreshedTimestamp={refreshedTimestamp} />
                    </View>
                );

            case 'today':
                return (
                    <View style={index !== 1 && { display: 'none' }}>
                        <TodayTabRoute userProfileModel={userProfileModel} refreshedTimestamp={refreshedTimestamp} />
                    </View>
                );

            case 'pillars':
                return (
                    <View style={index !== 2 && { display: 'none' }}>
                        <PillarsTabRoute userProfileModel={userProfileModel} />
                    </View>
                );
        }

        return <View></View>;
    };

    const [routes] = React.useState([
        { key: 'activity', title: 'Activity' },
        { key: 'today', title: 'Today' },
        { key: 'pillars', title: 'Pillars' },
    ]);

    return (
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
    );
};

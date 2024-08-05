import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { LeaderboardSelector } from './selector/LeaderboardSelector';
import { LeaderboardHightlightedLeader } from './selector/LeaderboardHighlightedLeader';
import { LeaderboardList } from './selector/LeaderboardList';
import { Constants } from 'resources/types/constants/constants';
import { LeaderboardCustomHooks } from 'src/controller/LeaderboardController';
import { PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { LeaderboardElement } from 'resources/types/dto/Leaderboard';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { useTheme } from '../theme/ThemeProvider';

export const Leaderboard = () => {
    const colors = useTheme().colors;
    const [leaderboardType, setLeaderboardType] = React.useState(Constants.LeaderboardType.TODAY);

    const currentUser = useAppSelector(getCurrentUser);
    const leaderboardData = LeaderboardCustomHooks.useLeaderboard(leaderboardType);

    const currentUserLeaderboardElement: LeaderboardElement = {
        user: currentUser,
        position: leaderboardData.data?.currentUserLeaderboardElement?.position ?? 0,
        points: leaderboardData.data?.currentUserLeaderboardElement?.points ?? 0,
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ paddingTop: PADDING_LARGE }}>
                <LeaderboardSelector
                    selectedType={leaderboardType}
                    setSelectedType={setLeaderboardType}
                />
            </View>

            {leaderboardData.data?.summary && (
                <View style={{ paddingTop: PADDING_LARGE }}>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontFamily: POPPINS_REGULAR,
                            color: colors.secondary_text,
                        }}
                    >
                        {leaderboardData.data?.summary}
                    </Text>
                </View>
            )}

            <ScrollView style={{ flex: 1 }}>
                {leaderboardData.data?.entries?.[0] && (
                    <LeaderboardHightlightedLeader element={leaderboardData.data.entries[0]} />
                )}

                <View style={{ flex: 1 }}>
                    {leaderboardData.data && (
                        <LeaderboardList
                            leaderboardData={leaderboardData.data}
                            currentUserLeaderboardElement={currentUserLeaderboardElement}
                        />
                    )}
                </View>
                <View style={{ height: PADDING_LARGE * 2 }} />
            </ScrollView>
        </View>
    );
};

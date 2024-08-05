import React from 'react';
import { ScrollView, View } from 'react-native';
import { LeaderboardSelector } from './selector/LeaderboardSelector';
import { LeaderboardList } from './selector/LeaderboardList';
import { Constants } from 'resources/types/constants/constants';
import { LeaderboardCustomHooks } from 'src/controller/LeaderboardController';
import { PADDING_EXTRA_LARGE, PADDING_LARGE } from 'src/util/constants';
import { LeaderboardElement } from 'resources/types/dto/Leaderboard';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { HorizontalLine } from '../common/HorizontalLine';
import { LeaderboardPodium } from './LeaderboardPodium';

export const Leaderboard = () => {
    const [leaderboardType, setLeaderboardType] = React.useState(Constants.LeaderboardType.TODAY);

    const currentUser = useAppSelector(getCurrentUser);
    const leaderboardData = LeaderboardCustomHooks.useLeaderboard(leaderboardType);

    const currentUserLeaderboardElement: LeaderboardElement = {
        user: currentUser,
        position: leaderboardData.data?.currentUserLeaderboardElement?.position ?? 0,
        points: leaderboardData.data?.currentUserLeaderboardElement?.points ?? 0,
    };

    return (
        <View style={{ flex: 1, paddingHorizontal: PADDING_LARGE }}>
            <View style={{ paddingVertical: PADDING_EXTRA_LARGE }}>
                <LeaderboardSelector
                    selectedType={leaderboardType}
                    setSelectedType={setLeaderboardType}
                />
            </View>

            <ScrollView style={{ flex: 1 }}>
                {leaderboardData.data && (
                    <View>
                        <LeaderboardPodium leaderboardData={leaderboardData.data} />
                        <View style={{ height: PADDING_EXTRA_LARGE }} />
                        <HorizontalLine />
                    </View>
                )}

                <View style={{ flex: 1, paddingTop: PADDING_LARGE }}>
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

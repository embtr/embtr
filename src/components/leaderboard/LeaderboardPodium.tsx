import { View } from 'react-native';
import { LeaderboardHightlightedLeader } from './selector/LeaderboardHighlightedLeader';
import { Leaderboard } from 'resources/types/dto/Leaderboard';

interface Props {
    leaderboardData: Leaderboard;
}

export const LeaderboardPodium = ({ leaderboardData }: Props) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            {leaderboardData.entries?.length > 1 && (
                <View style={{ flex: 1, alignSelf: 'flex-end' }}>
                    <LeaderboardHightlightedLeader element={leaderboardData.entries[1]} />
                </View>
            )}
            {leaderboardData.entries?.length > 0 && (
                <View style={{ flex: 1, alignSelf: 'flex-end' }}>
                    <LeaderboardHightlightedLeader element={leaderboardData.entries[0]} />
                </View>
            )}
            {leaderboardData.entries?.length > 2 && (
                <View style={{ flex: 1, alignSelf: 'flex-end' }}>
                    <LeaderboardHightlightedLeader element={leaderboardData.entries[2]} />
                </View>
            )}
        </View>
    );
};

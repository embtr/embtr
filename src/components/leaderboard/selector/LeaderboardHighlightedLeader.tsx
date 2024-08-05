import { View, Text } from 'react-native';
import { LeaderboardElement } from 'resources/types/dto/Leaderboard';
import { BadgeBelt } from 'src/components/common/badge/BadgeBelt';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getWindowWidth } from 'src/util/GeneralUtility';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_MEDIUM } from 'src/util/constants';

interface Props {
    element: LeaderboardElement;
}

export const LeaderboardHightlightedLeader = ({ element }: Props) => {
    const colors = useTheme().colors;

    const user = element.user;
    const commaSeparatedPoints = element.points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return (
        <View>
            <View style={{ height: PADDING_LARGE }} />

            <NavigatableUserImage user={user} size={getWindowWidth() / 3} />

            <View style={{ width: '100%', alignItems: 'center' }}>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingTop: PADDING_SMALL,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_MEDIUM,
                            fontSize: 16,
                            paddingRight: PADDING_SMALL / 2,
                        }}
                    >
                        {user.displayName}
                    </Text>

                    <BadgeBelt user={user} size={15} />
                </View>
                <View>
                    <Text
                        style={{
                            color: colors.secondary_text,
                        }}
                    >
                        {commaSeparatedPoints} points
                    </Text>
                </View>
            </View>
        </View>
    );
};

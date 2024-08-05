import { View, Text } from 'react-native';
import { LeaderboardElement } from 'resources/types/dto/Leaderboard';
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
    const position = element.position;
    const commaSeparatedPoints = element.points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const windowWidth = getWindowWidth() - PADDING_LARGE * 2;

    return (
        <View>
            <NavigatableUserImage
                user={user}
                size={windowWidth / (position === 1 ? 3 : position === 2 ? 5 : 6.5)}
            />

            <View style={{ alignItems: 'center' }}>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingTop: PADDING_SMALL,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="clip"
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_MEDIUM,
                            fontSize: 14,
                        }}
                    >
                        {user.displayName}
                    </Text>
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

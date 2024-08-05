import { View, Text } from 'react-native';
import { LeaderboardElement } from 'resources/types/dto/Leaderboard';
import { BadgeBelt } from 'src/components/common/badge/BadgeBelt';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { useTheme } from 'src/components/theme/ThemeProvider';
import {
    PADDING_LARGE,
    PADDING_SMALL,
    POPPINS_MEDIUM,
    POPPINS_SEMI_BOLD,
} from 'src/util/constants';

interface Props {
    element: LeaderboardElement;
}

export const LeaderboardListElement = ({ element }: Props) => {
    const { colors } = useTheme();
    const user = element.user;

    const commaSeparatedPoints = element.points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return (
        <View style={{ flexDirection: 'row' }}>
            {/* User Details */}
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexGrow: 1,
                }}
            >
                <View
                    style={{
                        paddingRight: PADDING_LARGE * 2,
                        paddingLeft: PADDING_LARGE,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: POPPINS_MEDIUM,
                            fontSize: 16,
                            includeFontPadding: false,
                            color: colors.text,
                        }}
                    >
                        {element.position}
                    </Text>
                </View>
                <View style={{ paddingRight: PADDING_LARGE * 2 }}>
                    <NavigatableUserImage user={user} size={45} />
                </View>
                <View
                    style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        flex: 1,
                    }}
                >
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: POPPINS_SEMI_BOLD,
                                    fontSize: 16,
                                    includeFontPadding: false,
                                    color: colors.text,
                                }}
                            >
                                {user.displayName}
                            </Text>

                            <View
                                style={{
                                    width: PADDING_SMALL / 2,
                                }}
                            />
                            <BadgeBelt user={user} size={13} />
                        </View>
                        <Text
                            style={{
                                includeFontPadding: false,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 11,
                                color: colors.secondary_text,
                            }}
                        >
                            {commaSeparatedPoints} points
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

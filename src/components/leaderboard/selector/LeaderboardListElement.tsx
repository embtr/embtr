import { View, Text } from 'react-native';
import { Icon } from 'resources/schema';
import { LeaderboardElement } from 'resources/types/dto/Leaderboard';
import { BadgeBelt } from 'src/components/common/badge/BadgeBelt';
import { OptimalImage } from 'src/components/common/images/OptimalImage';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { useTheme } from 'src/components/theme/ThemeProvider';
import {
    PADDING_LARGE,
    PADDING_SMALL,
    POPPINS_MEDIUM,
    POPPINS_SEMI_BOLD,
} from 'src/util/constants';

const CROWN_SIZE = 30;

const getPositionElement = (
    position: number,
    goldIcon: Icon,
    silverIcon: Icon,
    bronzeIcon: Icon,
    textColor?: string
) => {
    if (position === 1) {
        return (
            <View style={{ width: PADDING_LARGE * 6, alignItems: 'center' }}>
                <OptimalImage data={goldIcon} style={{ height: CROWN_SIZE, width: CROWN_SIZE }} />
            </View>
        );
    }

    if (position === 2) {
        return (
            <View style={{ width: PADDING_LARGE * 6, alignItems: 'center' }}>
                <OptimalImage data={silverIcon} style={{ height: CROWN_SIZE, width: CROWN_SIZE }} />
            </View>
        );
    }

    if (position === 3) {
        return (
            <View style={{ width: PADDING_LARGE * 6, alignItems: 'center' }}>
                <OptimalImage data={bronzeIcon} style={{ height: CROWN_SIZE, width: CROWN_SIZE }} />
            </View>
        );
    }

    return (
        <View style={{ width: PADDING_LARGE * 6, alignItems: 'center' }}>
            <Text
                style={{
                    fontFamily: POPPINS_MEDIUM,
                    fontSize: 16,
                    includeFontPadding: false,
                    color: textColor,
                }}
            >
                {position.toString()}
            </Text>
        </View>
    );
};

interface Props {
    element: LeaderboardElement;
    goldIcon: Icon;
    silverIcon: Icon;
    bronzeIcon: Icon;
}

export const LeaderboardListElement = ({ element, goldIcon, silverIcon, bronzeIcon }: Props) => {
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
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {getPositionElement(
                        element.position,
                        goldIcon,
                        silverIcon,
                        bronzeIcon,
                        colors.text
                    )}
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
                                numberOfLines={1}
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

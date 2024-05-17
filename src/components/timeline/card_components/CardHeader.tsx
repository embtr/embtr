import { Text, View } from 'react-native';
import { User } from 'resources/schema';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getDatePrettyWithYear, getHumanReadableDate } from 'src/util/DateUtility';
import {
    PADDING_SMALL,
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
} from 'src/util/constants';
import { TimelineElementType } from 'resources/types/requests/Timeline';
import { PremiumBadge } from 'src/components/common/PremiumBadge';
import { getDateFromDayKey } from 'src/controller/planning/PlannedDayController';
import { format } from 'date-fns';

interface Props {
    date: Date;
    user: User;
    dayKey?: string;
    secondaryText?: string;
    type: TimelineElementType;
}

export const CardHeader = ({ date, user, dayKey, secondaryText, type }: Props) => {
    const { colors } = useTheme();

    let datePretty = getHumanReadableDate(date);

    const label =
        type === TimelineElementType.USER_POST
            ? 'Post'
            : type === TimelineElementType.PLANNED_DAY_RESULT
                ? '' + format(getDateFromDayKey(dayKey ?? ''), 'MMMM dd, yyyy')
                : 'Challenge';

    const color =
        type === TimelineElementType.USER_POST
            ? colors.timeline_label_user_post
            : type === TimelineElementType.PLANNED_DAY_RESULT
                ? colors.link
                : colors.secondary_accent_color;

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
                <NavigatableUserImage user={user} size={45} />
                <View
                    style={{
                        paddingLeft: 12,
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
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    paddingRight: PADDING_SMALL / 3,
                                    fontFamily: POPPINS_SEMI_BOLD,
                                    fontSize: 16,
                                    color: colors.text,
                                }}
                            >
                                {user.displayName}
                            </Text>

                            <PremiumBadge user={user} size={14} />
                        </View>
                        <Text
                            style={{
                                includeFontPadding: false,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 11,
                                color: colors.secondary_text,
                            }}
                        >
                            {secondaryText ?? user.location}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Post and date details*/}
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: 4,
                }}
            >
                <Text
                    style={{
                        includeFontPadding: false,
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 10,
                        color: colors.secondary_text,
                        textAlign: 'right',
                    }}
                >
                    Posted {datePretty}
                </Text>
                <View
                    style={{
                        backgroundColor: color,
                        paddingHorizontal: 12,
                        paddingVertical: 2,
                        borderRadius: 50,
                    }}
                >
                    <Text
                        style={{
                            includeFontPadding: false,
                            fontFamily: POPPINS_SEMI_BOLD,
                            fontSize: 9,
                            color: colors.text,
                            textAlign: 'center',
                        }}
                    >
                        {label}
                    </Text>
                </View>
            </View>
        </View>
    );
};

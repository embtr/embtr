import { View, Text } from 'react-native';
import { User } from 'resources/schema';
import { TimelineType } from 'resources/types/Types';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getDatePrettyWithTime, getHumanReadableDate } from "src/util/DateUtility";
import { POPPINS_MEDIUM, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';

interface Props {
    date: Date;
    user: User;
    secondaryText?: string;
    type: TimelineType;
}

export const CardHeader = ({ date, user, secondaryText, type }: Props) => {
    const { colors } = useTheme();

    let datePretty = getHumanReadableDate(date);


    const label =
        type === TimelineType.USER_POST
            ? 'Post'
            : type === TimelineType.PLANNED_DAY_RESULT
            ? 'Daily Update'
            : 'Challenge';

    const color =
        type === TimelineType.USER_POST
            ? colors.timeline_label_user_post
            : type === TimelineType.PLANNED_DAY_RESULT
            ? colors.timeline_label_daily_results
            : colors.timeline_label_challenge;

    return (
        <View style={{ width: '100%', flexDirection: 'row' }}>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
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
                    <View style={{}}>
                        <Text
                            style={{
                                includeFontPadding: false,
                                fontFamily: POPPINS_SEMI_BOLD,
                                fontSize: 16,
                                color: colors.text,
                            }}
                        >
                            {user.displayName}
                        </Text>
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

                    <View style={{ flex: 1 }} />

                    <View
                        style={{
                            height: '100%',
                        }}
                    >
                        <Text
                            style={{
                                includeFontPadding: false,
                                bottom: 3,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 10,
                                color: colors.secondary_text,
                                textAlign: 'right',
                            }}
                        >
                            {datePretty}
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
            </View>
        </View>
    );
};

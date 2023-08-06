import { View, Text } from 'react-native';
import { User } from 'resources/schema';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getDatePrettyWithTime } from 'src/util/DateUtility';
import { POPPINS_MEDIUM, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';

interface Props {
    date: Date;
    secondaryText?: string;
    user: User;
}

export const CardHeader = ({ date, secondaryText, user }: Props) => {
    const { colors } = useTheme();

    const datePretty = getDatePrettyWithTime(date);
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
                            {user.location}
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
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 10,
                                color: colors.secondary_text,
                                textAlign: 'right',
                            }}
                        >
                            {datePretty}
                        </Text>
                        <Text
                            style={{
                                includeFontPadding: false,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 11,
                                color: colors.progress_bar_complete,
                                textAlign: 'right',
                            }}
                        >
                            {secondaryText}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

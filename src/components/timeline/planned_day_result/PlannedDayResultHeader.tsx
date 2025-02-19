import { View, Text } from 'react-native';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { PADDING_LARGE } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getDatePrettyWithTime } from 'src/util/DateUtility';
import { User } from 'resources/schema';

interface Props {
    user: User;
    date: Date;
}

export const PlannedDayResultHeader = ({ user, date }: Props) => {
    const { colors } = useTheme();

    const datePretty = getDatePrettyWithTime(date);

    return (
        <View style={{ width: '100%', flexDirection: 'row' }}>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingTop: PADDING_LARGE,
                    paddingLeft: PADDING_LARGE,
                }}
            >
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <NavigatableUserImage user={user} size={45} />

                    <View
                        style={{
                            paddingLeft: 10,
                            flex: 1,
                            alignSelf: 'stretch',
                        }}
                    >
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Poppins_600SemiBold',
                                        color: colors.timeline_card_header,
                                    }}
                                >
                                    {user.displayName}
                                </Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                            <Text
                                style={{
                                    fontFamily: 'Poppins_400Regular',
                                    fontSize: 10,
                                    color: colors.timeline_card_header,
                                }}
                            >
                                {user?.location}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View
                style={{
                    alignItems: 'flex-end',
                    paddingTop: PADDING_LARGE / 2,
                    paddingRight: PADDING_LARGE,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 12,
                        opacity: 0.75,
                        color: colors.secondary_text,
                    }}
                >
                    {datePretty}
                </Text>
            </View>
        </View>
    );
};

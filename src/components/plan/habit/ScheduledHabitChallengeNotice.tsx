import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { ChallengeBadge } from '../../common/comments/general/ChallengeBadge';

export const ScheduledHabitChallengeNotice = () => {
    const { colors } = useTheme();
    const { isChallenge } = useCreateEditScheduleHabit();

    if (!isChallenge) {
        return <View />;
    }

    return (
        <View
            style={{
                borderColor: '#404040',
                backgroundColor: '#343434',
                borderWidth: 1,
                justifyContent: 'center',
                alignContent: 'center',
                borderRadius: 5,
                padding: PADDING_SMALL,
                marginBottom: PADDING_LARGE,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ paddingRight: PADDING_LARGE, paddingLeft: PADDING_SMALL }}>
                    <ChallengeBadge size={45} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            flex: 1,
                            top: 2,
                            color: colors.text,
                            fontSize: 16,
                            fontFamily: POPPINS_MEDIUM,
                        }}
                    >
                        Edit Challenge Notice
                    </Text>
                    <Text
                        style={{
                            flex: 1,
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            paddingTop: PADDING_SMALL,
                        }}
                    >
                        Editing of this challenge has been limited to scheduling.
                    </Text>
                </View>
            </View>
        </View>
    );
};

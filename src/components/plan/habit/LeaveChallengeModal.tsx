import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { EmbtrModal } from 'src/components/common/modal/EmbtrModal';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { ScheduledHabitController } from 'src/controller/habit/ScheduledHabitController';
import PlannedDayController, {
    PlannedDayCustomHooks,
} from 'src/controller/planning/PlannedDayController';

interface Props {
    visible: boolean;
    onDismiss: Function;
    onExit: Function;
}

export const LeaveChallengeModalImproved = ({ visible, onDismiss, onExit }: Props) => {
    const { colors } = useTheme();

    const { title, challengeIds } = useCreateEditScheduleHabit();
    const currentDayKey = PlannedDayCustomHooks.useCurrentlySelectedPlannedDayKey();

    const onHandleDismiss = () => {
        onDismiss();
    };

    const leaveChallenge = async () => {
        onExit();

        const currentUserId = await getUserIdFromToken();
        if (!currentUserId) {
            return;
        }

        for (const challengeId of challengeIds) {
            await ChallengeController.leave(challengeId);
            ScheduledHabitController.invalidateActiveScheduledHabits();
            PlannedDayController.invalidatePlannedDay(currentUserId, currentDayKey);
        }
    };

    const body = (
        <View style={{ alignItems: 'center', margin: PADDING_LARGE }}>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        fontFamily: POPPINS_MEDIUM,
                        color: colors.text,
                        textAlign: 'center',
                    }}
                >
                    Leave Challenge{' '}
                    <Text
                        style={{
                            color: colors.secondary_accent_color,
                        }}
                    >
                        {title}
                    </Text>
                </Text>

                <View style={{ paddingTop: PADDING_LARGE }} />

                <View
                    style={{
                        borderColor: '#404040',
                        backgroundColor: '#343434',
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                        borderRadius: 5,
                        padding: PADDING_SMALL,
                        width: '100%',
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                    >
                        <Text
                            style={{
                                color: colors.secondary_text,
                                bottom: 1,
                                fontFamily: POPPINS_REGULAR,
                                paddingTop: PADDING_SMALL,
                            }}
                        >
                            If you leave this challenge you can always rejoin it later.
                        </Text>
                    </View>
                </View>

                <View style={{ paddingTop: PADDING_LARGE }} />

                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            flex: 1,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.link,
                                paddingVertical: 5,
                                borderRadius: 6,
                            }}
                            onPress={() => {
                                onHandleDismiss();
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 14,
                                    fontFamily: POPPINS_REGULAR,
                                    top: 2,
                                    color: colors.text,
                                    paddingHorizontal: PADDING_LARGE * 3,
                                }}
                            >
                                Nevermind
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                marginTop: 2.5,
                                width: '90%',
                                paddingVertical: 5,
                                borderRadius: 6,
                            }}
                            onPress={() => {
                                leaveChallenge();
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 14,
                                    fontFamily: POPPINS_REGULAR,
                                    top: 2,
                                    color: colors.archive,
                                    paddingHorizontal: PADDING_LARGE * 3,
                                }}
                            >
                                Leave
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <EmbtrModal visible={visible} onDismiss={onDismiss}>
            {body}
        </EmbtrModal>
    );
};

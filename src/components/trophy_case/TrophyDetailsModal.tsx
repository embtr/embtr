import { TouchableOpacity, View, Text } from 'react-native';
import { ChallengeParticipant } from 'resources/schema';
import { SvgUri } from 'react-native-svg';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { EmbtrModal } from 'src/components/common/modal/EmbtrModal';
import { PADDING_LARGE, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { getDatePrettyWithYear } from 'src/util/DateUtility';

interface Props {
    challengeParticipant?: ChallengeParticipant;
    visible: boolean;
    onDismiss: Function;
}

export const TrophyDetailsModal = ({ challengeParticipant, visible, onDismiss }: Props) => {
    const { colors } = useTheme();

    const challenge = challengeParticipant?.challenge;
    const award = challenge?.award;
    const completedDatePretty = getDatePrettyWithYear(award?.updatedAt ?? new Date());

    const onHandleDismiss = () => {
        onDismiss();
    };

    const body = (
        <View style={{ alignItems: 'center', paddingVertical: PADDING_LARGE }}>
            {/* TITLE SECTION */}
            <View
                style={{
                    width: '100%',
                }}
            >
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
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
                        {challenge?.name}
                    </Text>
                </View>
            </View>

            {/* INSTRUCTIONS SECTION */}
            <View
                style={{
                    paddingTop: PADDING_LARGE,
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <SvgUri width={100} height={100} uri={award?.remoteImageUrl ?? ''} />
            </View>

            {/* INSTRUCTIONS SECTION */}
            <View
                style={{
                    paddingTop: PADDING_LARGE,
                    paddingHorizontal: PADDING_LARGE,
                    width: '100%',
                }}
            >
                <Text
                    style={{
                        fontFamily: POPPINS_REGULAR,
                        color: colors.text,
                        textAlign: 'center',
                    }}
                >
                    {completedDatePretty}
                </Text>
            </View>

            {/* BUTTONS SECTION */}
            <View
                style={{
                    paddingTop: PADDING_LARGE,
                    width: '100%',
                }}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.accent_color_light,
                            paddingVertical: 5,
                            borderRadius: 6,
                        }}
                        onPress={() => {
                            onDismiss();
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
                            Got it!
                        </Text>
                    </TouchableOpacity>
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

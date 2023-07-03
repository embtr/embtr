import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ChallengeCalculationType, ChallengeParticipant } from 'resources/schema';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { CARD_SHADOW, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { getTimeLeft } from 'src/util/DateUtility';
import { ChallengeUtility } from 'src/util/challenge/ChallengeUtility';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { ChallengeBadge } from 'src/components/challenge/ChallengeBadge';
import CompletionStamp from 'src/components/common/stamp/CompletionStamp';

interface Props {
    challengeParticipant: ChallengeParticipant;
}

export const ActiveChallengeElement = ({ challengeParticipant }: Props) => {
    const { colors } = useTheme();

    if (!challengeParticipant.challenge) {
        return <View />;
    }

    const challenge = challengeParticipant.challenge;

    console.log(challenge);

    if (!challenge.challengeRequirements || challenge.challengeRequirements.length === 0) {
        return <View />;
    }
    const challengeRequirement = challenge.challengeRequirements[0];
    const amountComplete = challengeParticipant.amountComplete ?? 0;
    const amountRequired =
        (challengeRequirement.calculationType === ChallengeCalculationType.TOTAL
            ? challengeRequirement.requiredTaskQuantity
            : challengeRequirement.requiredIntervalQuantity) ?? 0;
    const percentComplete = Math.floor((amountComplete / amountRequired) * 100);

    const isComplete = amountComplete >= amountRequired;

    const description = challenge.description ?? '';

    const endDay = challenge.end ?? new Date();
    const daysLeft = getTimeLeft(endDay);

    const progressRemaining = ChallengeUtility.getChallengeRequirementProgressString(
        challengeRequirement,
        amountComplete,
        amountRequired
    );

    return (
        <View
            style={[
                {
                    width: 220,
                    backgroundColor: colors.button_background,
                    borderRadius: 3,
                    paddingHorizontal: 7.5,
                },
                CARD_SHADOW,
            ]}
        >
            {isComplete && (
                <View style={{ zIndex: 1, top: 20, left: '50%', position: 'absolute' }}>
                    <CompletionStamp />
                </View>
            )}
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <View>
                        <Text
                            numberOfLines={1}
                            style={{ color: colors.text, fontFamily: POPPINS_MEDIUM, fontSize: 12 }}
                        >
                            {challenge.name}
                        </Text>
                    </View>

                    <Text
                        numberOfLines={2}
                        style={{
                            height: 30,
                            bottom: isAndroidDevice() ? 3 : undefined,
                            color: colors.text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 9,
                        }}
                    >
                        {description}
                    </Text>
                </View>
                <View style={{ paddingTop: 3 }}>
                    <ChallengeBadge
                        reward={challenge.challengeRewards![0]}
                        size={20}
                        opaque={isComplete ? undefined : true}
                    />
                </View>
            </View>

            <Text
                style={{
                    paddingLeft: 3,
                    color: colors.secondary_text,
                    fontFamily: POPPINS_REGULAR,
                    fontSize: 10,
                }}
            >
                {progressRemaining} • {daysLeft}
            </Text>
            <View style={{ paddingBottom: 5, paddingTop: 1 }}>
                <ProgressBar
                    progress={percentComplete ? (percentComplete > 100 ? 100 : percentComplete) : 0}
                />
            </View>
        </View>
    );
};

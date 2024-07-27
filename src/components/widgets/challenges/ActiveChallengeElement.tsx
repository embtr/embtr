import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import {
    ChallengeCalculationType,
    ChallengeParticipant,
    ChallengeRequirementCompletionState,
} from 'resources/schema';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { getTimeLeft } from 'src/util/DateUtility';
import { ChallengeUtility } from 'src/util/challenge/ChallengeUtility';
import { ChallengeBadge } from 'src/components/challenge/ChallengeBadge';
import CompletionStamp from 'src/components/common/stamp/CompletionStamp';
import { getWindowWidth } from 'src/util/GeneralUtility';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';

interface Props {
    challengeParticipant: ChallengeParticipant;
}

export const ActiveChallengeElement = ({ challengeParticipant }: Props) => {
    const { colors } = useTheme();

    if (!challengeParticipant.challenge) {
        return <View />;
    }

    const challenge = challengeParticipant.challenge;

    const optimalImage: OptimalImageData = {
        icon: challenge.award?.icon,
    };

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

    const isComplete =
        challengeParticipant.challengeRequirementCompletionState ===
        ChallengeRequirementCompletionState.COMPLETED;

    const endDay = challenge.end ?? new Date();
    endDay.setHours(0, 0, 0, 0);
    const daysLeft = getTimeLeft(endDay);

    const progressRemaining = ChallengeUtility.getChallengeRequirementProgressString(
        challengeRequirement,
        amountComplete,
        amountRequired
    );

    return (
        <View
            style={{
                width: getWindowWidth() / 2,
                backgroundColor: colors.widget_element_background,
                borderRadius: 3,
                padding: 7.5,
            }}
        >
            {isComplete && (
                <View style={{ zIndex: 1, top: '30%', left: '50%', position: 'absolute' }}>
                    <CompletionStamp />
                </View>
            )}
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_MEDIUM,
                            fontSize: 14,
                            height: 20,
                        }}
                    >
                        {challenge.name}
                    </Text>
                </View>

                <ChallengeBadge optimalImage={optimalImage} size={20} opaque={!isComplete} />
            </View>

            <Text
                style={{
                    color: colors.secondary_text,
                    fontFamily: POPPINS_REGULAR,
                    fontSize: 10,
                }}
            >
                <Text
                    style={{
                        color: colors.secondary_accent_color,
                    }}
                >
                    {progressRemaining}
                </Text>{' '}
                •{' '}
                <Text
                    style={{
                        color: colors.secondary_text,
                    }}
                >
                    {daysLeft}
                </Text>
            </Text>
            <View style={{ paddingBottom: 5, paddingTop: 1 }}>
                <ProgressBar
                    progress={percentComplete ? (percentComplete > 100 ? 100 : percentComplete) : 0}
                />
            </View>
        </View>
    );
};

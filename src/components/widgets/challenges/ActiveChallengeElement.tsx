import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Challenge, ChallengeCompletionState } from 'resources/schema';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { CARD_SHADOW, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { getTimeLeft } from 'src/util/DateUtility';
import { ChallengeUtility } from 'src/util/challenge/ChallengeUtility';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { ChallengeBadge } from 'src/components/challenge/ChallengeBadge';
import CompletionStamp from 'src/components/common/stamp/CompletionStamp';

interface Props {
    challenge: Challenge;
}

export const ActiveChallengeElement = ({ challenge }: Props) => {
    const { colors } = useTheme();

    if (!challenge.challengeRequirements || challenge.challengeRequirements.length === 0) {
        return <View />;
    }
    const challengeRequirement = challenge.challengeRequirements[0];

    if (!challengeRequirement.custom.completionData) {
        return <View />;
    }
    const challengeCompletionData = challengeRequirement.custom.completionData;
    const isComplete =
        challengeCompletionData.challengeCompletionState === ChallengeCompletionState.COMPLETE;

    const description = challenge.description ?? '';
    const progressRemaining =
        ChallengeUtility.getChallengeRequirementProgressString(challengeRequirement);

    const endDay = challenge.end ?? new Date();
    const daysLeft = getTimeLeft(endDay);

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
                <View style={{ zIndex: -1, top: 20, left: '55%', position: 'absolute' }}>
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
                    progress={
                        challengeCompletionData.percentComplete
                            ? challengeCompletionData.percentComplete > 100
                                ? 100
                                : challengeCompletionData.percentComplete
                            : 0
                    }
                />
            </View>
        </View>
    );
};

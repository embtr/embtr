import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Challenge } from 'resources/schema';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { CARD_SHADOW, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { getTimeLeft } from 'src/util/DateUtility';
import { ChallengeUtility } from 'src/util/challenge/ChallengeUtility';
import { isAndroidDevice } from 'src/util/DeviceUtil';

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

    const description = challenge.description ?? '';
    const progressRemaining =
        ChallengeUtility.getChallengeRequirementProgressString(challengeRequirement);

    const endDay = challenge.end ?? new Date();
    const daysLeft = getTimeLeft(endDay);

    return (
        <View
            style={[
                {
                    width: 200,
                    backgroundColor: colors.button_background,
                    borderRadius: 3,
                    paddingHorizontal: 7.5,
                },
                CARD_SHADOW,
            ]}
        >
            <View style={{}}>
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
                <ProgressBar progress={challengeCompletionData.percentComplete ?? 0} />
            </View>
        </View>
    );
};

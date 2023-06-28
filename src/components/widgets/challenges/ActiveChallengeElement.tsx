import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Challenge } from 'resources/schema';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { CARD_SHADOW, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { getTimeLeft } from 'src/util/DateUtility';

interface Props {
    challenge: Challenge;
}

export const ActiveChallengeElement = ({ challenge }: Props) => {
    const { colors } = useTheme();

    const percentComplete = challenge.challengeRequirements?.reduce(
        (acc, requirement) => acc + requirement.custom.percentComplete,
        0
    );

    const endDay = challenge.end ?? new Date();
    const daysLeft = getTimeLeft(endDay);

    return (
        <View
            style={[
                {
                    backgroundColor: colors.button_background,
                    borderRadius: 3,
                    paddingHorizontal: 7.5,
                    paddingBottom: 5,
                },
                CARD_SHADOW,
            ]}
        >
            <Text style={{ color: colors.text, fontFamily: POPPINS_MEDIUM, fontSize: 13 }}>
                {challenge.name}
            </Text>
            <Text
                style={{
                    paddingLeft: 3,
                    color: colors.secondary_text,
                    fontFamily: POPPINS_REGULAR,
                    fontSize: 10,
                }}
            >
                10 miles to go! • {daysLeft}
            </Text>
            <ProgressBar progress={percentComplete ?? 0} />
        </View>
    );
};

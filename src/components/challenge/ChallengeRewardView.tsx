import { CARD_SHADOW, POPPINS_REGULAR } from 'src/util/constants';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { shouldUseNarrowView } from 'src/util/GeneralUtility';
import { ChallengeReward } from 'resources/schema';
import { ChallengeBadge } from './ChallengeBadge';

interface Props {
    reward: ChallengeReward;
}

export const ChallengeRewardView = ({ reward }: Props) => {
    const { colors } = useTheme();
    const useNarrowView = shouldUseNarrowView();

    if (!reward.remoteImageUrl) {
        return <View />;
    }

    return (
        <View
            style={[
                {
                    alignSelf: 'flex-start',
                    borderRadius: 5,
                    flexDirection: 'row',
                    padding: useNarrowView ? 7.5 : 15,
                    backgroundColor: colors.text_input_background_secondary,
                    alignItems: 'center',
                },
                CARD_SHADOW,
            ]}
        >
            <ChallengeBadge reward={reward} size={30} />
            <Text
                style={{
                    paddingLeft: 7,
                    fontFamily: POPPINS_REGULAR,
                    color: colors.text,
                    fontSize: useNarrowView ? 12 : 17,
                }}
            >
                {reward.name}
            </Text>
        </View>
    );
};

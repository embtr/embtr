import { CARD_SHADOW, POPPINS_REGULAR } from 'src/util/constants';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { shouldUseNarrowView } from 'src/util/GeneralUtility';
import { ChallengeBadge } from './ChallengeBadge';
import { Award } from 'resources/types/dto/Challenge';
import { OptimalImageData } from '../common/images/OptimalImage';

interface Props {
    award: Award;
}

export const ChallengeAward = ({ award }: Props) => {
    const { colors } = useTheme();
    const useNarrowView = shouldUseNarrowView();

    const optimalImage: OptimalImageData = {
        remoteImageUrl: award.remoteImageUrl,
        localImage: award.localImage,
    };

    if (!award.remoteImageUrl) {
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
                    backgroundColor: colors.widget_element_background,
                    alignItems: 'center',
                },
                CARD_SHADOW,
            ]}
        >
            <ChallengeBadge optimalImage={optimalImage} size={30} />
            <Text
                style={{
                    paddingLeft: 7,
                    fontFamily: POPPINS_REGULAR,
                    color: colors.text,
                    fontSize: useNarrowView ? 12 : 17,
                }}
            >
                {award.name}
            </Text>
        </View>
    );
};

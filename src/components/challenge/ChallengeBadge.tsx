import { POPPINS_REGULAR } from 'src/util/constants';

import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { shouldUseNarrowView } from 'src/util/GeneralUtility';
export const ChallengeBadge = () => {
    const { colors } = useTheme();
    const useNarrowView = shouldUseNarrowView();

    return (
        <View
            style={{
                alignSelf: 'flex-start',
                borderRadius: 5,
                flexDirection: 'row',
                padding: useNarrowView ? 7.5 : 15,
                backgroundColor: colors.text_input_background_secondary,
                alignItems: 'center',
            }}
        >
            <Ionicons name={'water-outline'} size={useNarrowView ? 20 : 40} color={colors.link} />
            <Text
                style={{
                    paddingLeft: 5,
                    fontFamily: POPPINS_REGULAR,
                    color: colors.tab_selected,
                    fontSize: useNarrowView ? 12 : 17,
                }}
            >
                Hydration Badge
            </Text>
        </View>
    );
};

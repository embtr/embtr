import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_LARGE, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { FeatureVoteElements } from './FeatureVoteElements';

export const FeatureVote = () => {
    const colors = useTheme().colors;

    return (
        <Screen>
            <Banner name="New Feature Vote" leftIcon={'arrow-back'} leftRoute="BACK" />

            <ScrollView>
                <View style={{ paddingHorizontal: PADDING_LARGE }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 13,
                            }}
                        >
                            Vote for your favorite upcoming feature and get a notified when it's
                            available for you to use!
                        </Text>
                    </View>

                    <View style={{ paddingTop: PADDING_LARGE }}>
                        <FeatureVoteElements />
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
};

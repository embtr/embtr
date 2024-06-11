import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_LARGE, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { AwayModeSettings } from './AwayModeSettings';

export const AwayMode = () => {
    const colors = useTheme().colors;

    return (
        <Screen>
            <Banner name="Away Mode" leftIcon={'arrow-back'} leftRoute="BACK" />

            <ScrollView>
                <View style={{ paddingHorizontal: PADDING_LARGE }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 12,
                            }}
                        >
                            Use Away Mode to pause your habit responsibilities and preserve your
                            streak data.
                        </Text>
                    </View>

                    <View style={{ paddingTop: PADDING_LARGE }}>
                        <View>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontFamily: POPPINS_MEDIUM,
                                    fontSize: 16,
                                    flex: 1,
                                }}
                            >
                                Away Status
                            </Text>
                            <AwayModeSettings />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
};

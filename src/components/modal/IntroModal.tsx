import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';
import { GlobalStateCustomHooks } from 'src/redux/user/GlobalStateCustomHooks';
import { TutorialIslandQuickFlow } from 'src/model/tutorial_island/flows/TutorialIslandQuickFlow';
import { useEmbtrTutorialIslandNavigation } from 'src/hooks/NavigationHooks';
import { TutorialIslandRoutes } from 'src/navigation/RootStackParamList';

export const IntroModal = () => {
    const { colors } = useTheme();
    const navigation = useEmbtrTutorialIslandNavigation();

    const setTutorialIslandState = GlobalStateCustomHooks.useSetTutorialIslandState();

    const onJumpRightIn = () => {
        navigation.popToTop();
        navigation.navigate(TutorialIslandRoutes.TUTROIAL_ISLAND_QUICK_CREATE_HABITS);
        setTutorialIslandState(TutorialIslandQuickFlow);
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background,
                justifyContent: 'center',
            }}
        >
            <View style={{ flex: 0.125 }} />
            <View style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Image
                        source={require('assets/logo.png')}
                        style={{ width: 150, height: 150 }}
                    />
                    <View>
                        <Text
                            style={{
                                paddingTop: PADDING_LARGE,
                                color: colors.text,
                                textAlign: 'center',
                                fontSize: 24,
                                fontFamily: POPPINS_MEDIUM,
                            }}
                        >
                            Getting Started
                        </Text>
                    </View>

                    <View
                        style={{
                            paddingTop: PADDING_LARGE,
                            paddingHorizontal: PADDING_LARGE,
                            flexDirection: 'row',
                            width: '100%',
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.secondary_text,
                                    fontFamily: POPPINS_REGULAR,
                                    fontSize: 14,
                                    textAlign: 'center',
                                }}
                            >
                                It's time to build those habits and crush your goals!
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1 }}>
                    <View
                        style={{
                            width: '100%',
                            paddingTop: PADDING_LARGE * 2,
                        }}
                    >
                        <TouchableOpacity
                            onPress={onJumpRightIn}
                            style={{
                                marginHorizontal: PADDING_LARGE,
                                backgroundColor: colors.accent_color,
                                borderRadius: 5,
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.text,
                                    textAlign: 'center',
                                    fontFamily: POPPINS_MEDIUM,
                                    paddingVertical: PADDING_LARGE / 2,
                                }}
                            >
                                Let's Get It!
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

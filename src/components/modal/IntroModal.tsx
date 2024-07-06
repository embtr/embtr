import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { MainTabScreens } from 'src/navigation/RootStackParamList';
import { POPPINS_MEDIUM, POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';
import { GlobalStateCustomHooks } from 'src/redux/user/GlobalStateCustomHooks';
import { TutorialIslandCreateHabitFlow } from 'src/model/tutorial_island/flows/TutorialIslandCreateHabitFlow';

export const IntroModal = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<MainTabScreens>>();

    const setTutorialIslandState = GlobalStateCustomHooks.useSetTutorialIslandState();
    const onLetsGo = () => {
        navigation.popToTop();
        setTutorialIslandState(TutorialIslandCreateHabitFlow);
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
            <View style={{ alignItems: 'center', flex: 1 }}>
                <Image source={require('assets/logo.png')} style={{ width: 150, height: 150 }} />
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
                            Let's run a quick tutorial to help you learn the basics of embtr.
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        width: '100%',
                        paddingTop: PADDING_LARGE * 2,
                    }}
                >
                    <TouchableOpacity
                        onPress={onLetsGo}
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
                            Let's Go!
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

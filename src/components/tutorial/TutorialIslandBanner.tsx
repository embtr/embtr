import { View, Text, TextStyle, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmbtrMenuOptions } from 'src/components/common/menu/EmbtrMenuOption';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getOpenMenu, getCloseMenu, setMenuOptions } from 'src/redux/user/GlobalState';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import {
    CARD_SHADOW,
    PADDING_MEDIUM,
    PADDING_SMALL,
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
} from 'src/util/constants';
import { useNetInfo } from '@react-native-community/netinfo';
import { isNarrowDevice } from 'src/util/DeviceUtil';
import { TutorialIslandElement } from './TutorialIslandElement';
import { TutorialIslandOptionKey } from 'src/model/tutorial_island/TutorialIslandModels';

interface Props {
    name: string;
    leftRoute?: string;
    leftIcon?: any;
    leftText?: string;
    rightText?: string;

    innerLeftIcon?: any;
    leftOnClick?: Function;
    innerLeftOnClick?: Function;

    innerRightIcon?: any;
    innerRightOnClick?: Function;
    rightColor?: string;
    rightRoute?: string;
    rightIcon?: any;
    rightOnClick?: Function;
    rightIconNotificationCount?: number;

    rightEnabled?: boolean;
    rightButton?: string;

    menuOptions?: EmbtrMenuOptions;
}

export const TutorialIslandBanner = ({
    name,
    leftRoute,
    leftIcon,
    rightRoute,
    leftText,
    rightText,
    rightOnClick,
    rightIcon,
    rightIconNotificationCount,
    rightColor,
    innerLeftIcon,
    leftOnClick,
    innerLeftOnClick: innerLeftCallback,
    menuOptions,
    innerRightIcon,
    innerRightOnClick,
    rightEnabled,
    rightButton,
}: Props) => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const iconSize = 30;
    const bannerSize = isNarrowDevice() ? 18 : 20;

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const netInfo = useNetInfo();
    const isConnectedToNetwork = netInfo.isConnected;

    const dispatch = useAppDispatch();
    const updateMenuOptions = () => {
        dispatch(setMenuOptions(menuOptions));
    };

    const openMenu = useAppSelector(getOpenMenu);
    const closeMenu = useAppSelector(getCloseMenu);

    const handleRightClick = () => {
        if (rightOnClick) {
            rightOnClick();
        }

        if (menuOptions) {
            updateMenuOptions();
            openMenu();
        }

        if (rightRoute) {
            navigation.navigate(rightRoute as keyof RootStackParamList);
        }
    };

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
    });

    if (!fontsLoaded) {
        return <View />;
    }

    const leftOnPress = () => {
        leftOnClick
            ? leftOnClick()
            : leftRoute === 'BACK'
                ? navigation.goBack()
                : navigation.navigate(leftRoute as keyof RootStackParamList);
    };

    const rightOnPress = () => {
        rightOnClick
            ? rightOnClick()
            : rightRoute === 'BACK'
                ? navigation.goBack()
                : navigation.navigate(leftRoute as keyof RootStackParamList);
    };

    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        paddingLeft: 10,
                        alignItems: 'center',
                    }}
                >
                    <TutorialIslandElement optionKey={TutorialIslandOptionKey.INVALID}>
                        {/* LEFT ICON */}
                        {leftIcon ? (
                            <Ionicons
                                name={leftIcon}
                                size={iconSize}
                                color={colors.text}
                                onPress={leftOnPress}
                            />
                        ) : leftText ? (
                            <View
                                style={{
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    onPress={leftOnPress}
                                    style={{
                                        textAlign: 'center',
                                        fontFamily: 'Poppins_400Regular',
                                        color: colors.link,
                                        fontSize: 16,
                                    }}
                                >
                                    {leftText}
                                </Text>
                            </View>
                        ) : (
                            <View />
                        )}

                        {/* INNER LEFT ICON */}
                        {innerLeftIcon ? (
                            <Ionicons
                                style={{ paddingLeft: 10 }}
                                name={innerLeftIcon}
                                size={iconSize}
                                color={colors.text}
                                onPress={() => {
                                    if (innerLeftCallback) innerLeftCallback();
                                }}
                            />
                        ) : (
                            <View />
                        )}
                    </TutorialIslandElement>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text
                        numberOfLines={1}
                        style={[
                            textStyle,
                            {
                                textAlign: 'center',
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: bannerSize,
                            },
                        ]}
                    >
                        {name}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        paddingRight: 10,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}
                >
                    <TutorialIslandElement optionKey={TutorialIslandOptionKey.BANNER_RIGHT}>
                        {/* INNER RIGHT ICON */}
                        {!isConnectedToNetwork ? (
                            <Ionicons
                                style={{ paddingRight: 10 }}
                                name={'cloud-offline-outline'}
                                size={iconSize}
                                color={colors.progress_bar_failed}
                                onPress={() => {
                                    if (innerRightOnClick) innerRightOnClick();
                                }}
                            />
                        ) : (
                            innerRightIcon && (
                                <Ionicons
                                    style={{ paddingRight: 10 }}
                                    name={innerRightIcon}
                                    size={iconSize}
                                    color={colors.text}
                                    onPress={() => {
                                        if (innerRightOnClick) innerRightOnClick();
                                    }}
                                />
                            )
                        )}

                        {/* RIGHT ICON */}
                        {rightIcon && (
                            <View style={{ alignItems: 'flex-end' }}>
                                {rightIconNotificationCount ? (
                                    <View
                                        style={{
                                            paddingRight: 1,
                                            zIndex: 1,
                                            position: 'absolute',
                                        }}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: colors.accent_color,
                                                borderRadius: 50,
                                                width: 9,
                                                height: 9,
                                            }}
                                        />
                                    </View>
                                ) : (
                                    <></>
                                )}

                                <Ionicons
                                    name={rightIcon}
                                    size={iconSize}
                                    color={rightColor ?? colors.text}
                                    onPress={handleRightClick}
                                />
                            </View>
                        )}

                        {/* RIGHT ICON */}
                        {rightText && (
                            <View style={{ alignItems: 'flex-end', flex: 1 }}>
                                <View
                                    style={{
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text
                                        onPress={
                                            rightEnabled === false
                                                ? undefined
                                                : () => {
                                                    rightOnPress();
                                                }
                                        }
                                        style={{
                                            textAlign: 'center',
                                            fontFamily: POPPINS_REGULAR,
                                            color: rightColor ?? colors.link,
                                            fontSize: 16,
                                        }}
                                    >
                                        {rightText}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* RIGHT TEXT */}
                        {rightButton && (
                            <View>
                                <TouchableOpacity
                                    onPress={() => {
                                        rightOnClick?.();
                                    }}
                                    style={[
                                        {
                                            flexDirection: 'row',
                                            backgroundColor: colors.accent_color,
                                            borderRadius: 5,
                                            paddingHorizontal: 4,
                                            paddingVertical: 2,
                                        },
                                        CARD_SHADOW,
                                    ]}
                                >
                                    <Text
                                        style={{
                                            color: colors.text,
                                            fontSize: 12,
                                            fontFamily: POPPINS_REGULAR,
                                            paddingHorizontal: PADDING_SMALL / 2,
                                        }}
                                    >
                                        {rightButton}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </TutorialIslandElement>
                </View>
            </View>
            <View style={{ height: PADDING_MEDIUM }} />
        </View>
    );
};

import { View, Text, TextStyle, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmbtrMenuOptions } from 'src/components/common/menu/EmbtrMenuOption';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getOpenMenu, setMenuOptions } from 'src/redux/user/GlobalState';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import {
    CARD_SHADOW,
    PADDING_LARGE,
    PADDING_MEDIUM,
    PADDING_SMALL,
    PADDING_TINY,
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
} from 'src/util/constants';
import { useNetInfo } from '@react-native-community/netinfo';
import { isNarrowDevice } from 'src/util/DeviceUtil';
import { OptimalImage } from './images/OptimalImage';
import { LevelCustomHooks } from 'src/controller/level/LevelController';

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
    innerRightPoints?: boolean;
    rightColor?: string;
    rightRoute?: string;
    rightIcon?: any;
    rightOnClick?: Function;
    rightIconNotificationCount?: number;

    rightEnabled?: boolean;
    rightButton?: boolean;

    menuOptions?: EmbtrMenuOptions;
}

export const Banner = ({
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
    innerRightPoints,
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
    const levelDetails = LevelCustomHooks.useLevelDetailsForCurrentUser();

    // localizing the points
    const pointsText = levelDetails.data?.points.toLocaleString() ?? '0';

    const netInfo = useNetInfo();
    const isConnectedToNetwork = netInfo.isConnected;

    const dispatch = useAppDispatch();
    const updateMenuOptions = () => {
        dispatch(setMenuOptions(menuOptions));
    };

    const openMenu = useAppSelector(getOpenMenu);

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

                {/* THE RIGHT SIDE OF THE BANNER */}
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        paddingRight: 10,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ flex: 1 }}>
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
                        ) : innerRightPoints ? (
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <View style={{ paddingRight: PADDING_TINY }}>
                                    <OptimalImage
                                        style={{ height: 15, width: 15 }}
                                        data={{ localImage: 'GENERAL.POINTS' }}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontFamily: POPPINS_REGULAR,
                                        color: colors.text,
                                        fontSize: 14,
                                        paddingRight: PADDING_LARGE,
                                    }}
                                >
                                    {pointsText}
                                </Text>
                            </View>
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
                    </View>

                    {/* FAR RIGHT ICON/ TEXT */}
                    <View style={{}}>
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

                        {/* RIGHT TEXT */}
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
                                        //scrollToToday();
                                    }}
                                    style={[
                                        {
                                            flexDirection: 'row',
                                            backgroundColor: '#404040',
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
                                        Today
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </View>
            <View style={{ height: PADDING_MEDIUM }} />
        </View>
    );
};

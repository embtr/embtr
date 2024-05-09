import { View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getOpenMenu, getShowCardShadow, setMenuOptions } from 'src/redux/user/GlobalState';
import { CARD_SHADOW, IoniconName, PADDING_LARGE, PADDING_SMALL } from 'src/util/constants';
import { createEmbtrMenuOptions, EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { isAndroidDevice } from 'src/util/DeviceUtil';

interface Props {
    children: any;
    menuOptions?: EmbtrMenuOption[];
    symbol?: IoniconName;
    onPressSymbol?: Function;
    backgroundColor?: string;
}

export const WidgetBase = ({
    children,
    menuOptions,
    symbol,
    onPressSymbol,
    backgroundColor,
}: Props) => {
    const { colors } = useTheme();

    const dispatch = useAppDispatch();
    const openMenu = useAppSelector(getOpenMenu);
    const useCardShadow = isAndroidDevice() && useAppSelector(getShowCardShadow);

    const updateMenuOptions = () => {
        if (menuOptions) {
            dispatch(setMenuOptions(createEmbtrMenuOptions(menuOptions)));
        }
    };

    return (
        <View
            style={[
                {
                    borderRadius: 9,
                    backgroundColor: backgroundColor ?? colors.card_background,
                    paddingVertical: PADDING_LARGE,
                    paddingHorizontal: PADDING_LARGE,
                },
                useCardShadow ? CARD_SHADOW : {},
            ]}
        >
            {menuOptions && (
                <View
                    style={{
                        width: '100%',
                        zIndex: 1,
                        position: 'absolute',
                        alignSelf: 'flex-end',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                    }}
                >
                    <TouchableWithoutFeedback
                        style={{ padding: 4, paddingLeft: 7, paddingBottom: 7 }}
                        onPress={() => {
                            if (onPressSymbol) {
                                onPressSymbol();
                            } else {
                                updateMenuOptions();
                                openMenu();
                            }
                        }}
                    >
                        <View
                            style={{
                                paddingLeft: PADDING_LARGE,
                                paddingRight: PADDING_SMALL,
                                flexDirection: 'row',
                            }}
                        >
                            <Ionicons
                                name={symbol ?? 'ellipsis-horizontal'}
                                size={20}
                                color={colors.text}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )}
            {children}
        </View>
    );
};

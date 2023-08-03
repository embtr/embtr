import { View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getOpenMenu, getShowCardShadow, setMenuOptions } from 'src/redux/user/GlobalState';
import { CARD_SHADOW, IoniconName } from 'src/util/constants';
import { createEmbtrMenuOptions, EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { isAndroidDevice } from 'src/util/DeviceUtil';

interface Props {
    children: any;
    menuOptions?: EmbtrMenuOption[];
    symbol?: IoniconName;
    onPressSymbol?: Function;
}

export const WidgetBase = ({ children, menuOptions, symbol, onPressSymbol }: Props) => {
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
                    backgroundColor: colors.timeline_card_background,
                    paddingTop: 5,
                    paddingBottom: 8,
                    paddingLeft: 8,
                    paddingRight: 8,
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
                                paddingTop: 3,
                                paddingRight: 3,
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

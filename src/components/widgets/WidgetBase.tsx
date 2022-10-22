import { Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getOpenMenu, setMenuOptions } from 'src/redux/user/GlobalState';
import { CARD_SHADOW } from 'src/util/constants';
import { createEmbtrMenuOptions, EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
    children: any;
    menuOptions?: EmbtrMenuOption[];
}

export const WidgetBase = ({ children, menuOptions }: Props) => {
    const { colors } = useTheme();

    const dispatch = useAppDispatch();
    const openMenu = useAppSelector(getOpenMenu);

    const updateMenuOptions = () => {
        if (menuOptions) {
            dispatch(setMenuOptions(createEmbtrMenuOptions(menuOptions)));
        }
    };

    return (
        <View style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 5 }}>
            <View
                style={[
                    {
                        borderRadius: 15,
                        backgroundColor: colors.timeline_card_background,
                        paddingTop: 5,
                        paddingBottom: 8,
                        paddingLeft: 8,
                        paddingRight: 8,
                    },
                    CARD_SHADOW,
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
                            paddingRight: 5,
                            justifyContent: 'center',
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => {
                                updateMenuOptions();
                                openMenu();
                            }}
                        >
                            <Text style={{ color: colors.text, justifyContent: 'center' }}> ... </Text>
                        </TouchableWithoutFeedback>
                    </View>
                )}
                {children}
            </View>
        </View>
    );
};

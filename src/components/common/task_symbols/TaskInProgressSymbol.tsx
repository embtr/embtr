import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import {
    POPPINS_SEMI_BOLD,
    SYMBOL_BORDER_RADIUS_LARGE,
    SYMBOL_BORDER_RADIUS_SMALL,
    SYMBOL_BORDER_WIDTH_LARGE,
    SYMBOL_BORDER_WIDTH_SMALL,
    SYMBOL_FONT_SIZE_LARGE,
    SYMBOL_FONT_SIZE_SMALL,
    SYMBOL_SIZE_LARGE,
    SYMBOL_SIZE_SMALL,
} from 'src/util/constants';

interface Props {
    small?: boolean;
}

export const TaskInProgressSymbol = ({ small }: Props) => {
    const { colors } = useTheme();
    const color = 'gray';

    const borderSize = small === true ? SYMBOL_SIZE_SMALL : SYMBOL_SIZE_LARGE;
    const borderRadius = small === true ? SYMBOL_BORDER_RADIUS_SMALL : SYMBOL_BORDER_RADIUS_LARGE;
    const borderWidth = small === true ? SYMBOL_BORDER_WIDTH_SMALL : SYMBOL_BORDER_WIDTH_LARGE;
    const fontSize = small === true ? SYMBOL_FONT_SIZE_SMALL : SYMBOL_FONT_SIZE_LARGE;

    return (
        <View
            style={{
                width: borderSize,
                height: borderSize,
                borderColor: color,
                borderWidth: borderWidth,
                borderRadius: borderRadius,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: color, fontSize: fontSize, fontFamily: POPPINS_SEMI_BOLD }}>
                    ~
                </Text>
            </View>
        </View>
    );
};

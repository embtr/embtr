import { Text, View } from 'react-native';
import { CARD_SHADOW } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
    children: any;
}

export const WidgetBase = ({ children }: Props) => {
    const { colors } = useTheme();

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
                {children}
            </View>
        </View>
    );
};

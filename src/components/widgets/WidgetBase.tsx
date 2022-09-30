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
            <View style={{ position: 'absolute', zIndex: 1, width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <Text style={{ color: 'white' }}>...</Text>
            </View>
            <View
                style={[
                    {
                        borderRadius: 15,
                        backgroundColor: colors.timeline_card_background,
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingLeft: 10,
                        paddingRight: 10,
                    },
                    CARD_SHADOW,
                ]}
            >
                {children}
            </View>
        </View>
    );
};

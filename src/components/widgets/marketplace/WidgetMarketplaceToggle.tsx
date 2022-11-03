import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_MEDIUM, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';

interface Props {
    name: string;
    description: string;
    isEnabled: boolean;
    onToggle: Function;
}

export const WidgetMarketplaceToggle = ({ name, description, isEnabled, onToggle }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ width: '100%', alignItems: 'center' }}>
            <View style={[{ backgroundColor: colors.timeline_card_background, width: '97%', height: 80, borderRadius: 10 }, CARD_SHADOW]}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ paddingLeft: 5, flex: 7 }}>
                        <Text style={{ color: colors.text, fontSize: 15, fontFamily: POPPINS_MEDIUM }}>{name}</Text>
                        <View style={{ paddingTop: 3 }}>
                            <Text style={{ color: colors.secondary_text, fontSize: 12, fontFamily: POPPINS_REGULAR }}>{description}</Text>
                            <Text style={{ color: colors.secondary_text, fontSize: 10, fontFamily: POPPINS_REGULAR }}>10 Downloads • ★★★★★ </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        disabled={isEnabled}
                        onPress={() => {
                            onToggle(name, true);
                        }}
                    >
                        <View style={{ height: '100%', alignItems: 'flex-end', flex: 1.5, paddingTop: 10, paddingRight: 10 }}>
                            <View
                                style={{
                                    paddingLeft: 5,
                                    paddingRight: 5,
                                    backgroundColor: isEnabled ? colors.text : colors.toggle_background_selected,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 10,
                                }}
                            >
                                <Text style={{ fontFamily: POPPINS_SEMI_BOLD, color: isEnabled ? colors.text_opposite : 'black' }}>
                                    {isEnabled ? 'ADDED' : 'ADD'}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

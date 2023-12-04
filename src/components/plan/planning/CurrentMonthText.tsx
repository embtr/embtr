import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_SEMI_BOLD, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface Props {
    onPress: () => void;
    advancedVisible: boolean;
    initialMonth: string;
}

export const CurrentMonthText = React.forwardRef(
    ({ onPress, advancedVisible, initialMonth }: Props, ref) => {
        const { colors } = useTheme();
        const [month, setMonth] = React.useState(initialMonth);

        const changeMonth = (newMonth: string) => {
            setMonth(newMonth);
        };
        
        console.log("MONSTER IS RENDERING")

        const internalRef = React.useRef();

        React.useImperativeHandle(
            ref,
            () => ({
                changeMonth,
                value: internalRef.current,
            }),
            [internalRef.current]
        );

        return (
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                    Habits for{' '}
                </Text>
                <TouchableOpacity onPress={onPress}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{
                                color: colors.accent_color,
                                fontFamily: POPPINS_SEMI_BOLD,
                                fontSize: 15,
                            }}
                        >
                            {month}
                        </Text>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingLeft: TIMELINE_CARD_PADDING / 4,
                            }}
                        >
                            <Ionicons
                                name={advancedVisible ? 'chevron-up' : 'chevron-down'}
                                size={16}
                                color={colors.text}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
);


import * as React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    details: EmbtrMenuOption
}

export const EmbtrMenuOptionCustom = ({ details }: Props) => {
    const { colors } = useTheme();

    return (
        <View>
            <HorizontalLine />
            <TouchableOpacity onPress={() => { details.onPress() }} >
                <View>
                    <View style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 10 }} >
                        <Text style={{ fontSize: 16 }}>
                            {details.name}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}
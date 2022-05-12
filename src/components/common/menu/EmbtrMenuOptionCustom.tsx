
import * as React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    name: string,
    onPress: Function
}

export const EmbtrMenuOptionCustom = ({ name, onPress }: Props) => {
    const { colors } = useTheme();

    return (
        <View>
            <HorizontalLine />
            <TouchableOpacity onPress={() => { onPress() }} >
                <View>
                    <View style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 10 }} >
                        <Text style={{ fontSize: 16 }}>
                            {name}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}
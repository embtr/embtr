import * as React from 'react';
import { View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';


export const AddButton = () => {
    const { colors } = useTheme();

    const shadow = {
        shadowColor: colors.text,
        shadowOffset: { width: -2, height: 2 },
        shadowOpacity: .5,
        shadowRadius: 2.5,
        elevation: 10,
    }


    return (
            <TouchableOpacity style={{width: 70, height: 70}} onPress={() => { alert("pressed!") }}>
                <View style={[shadow, { margin: 10, paddingLeft: 2, paddingTop: 1, backgroundColor: colors.text, width: 50, height: 50, borderRadius: 50, alignContent: "center", alignItems: "center", justifyContent: "center" }]}>
                    <Ionicons name={"add"} size={30} color={colors.card_background} />
                </View>
            </TouchableOpacity>
    );
}
import * as React from 'react';
import { Text, TextStyle, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';

export const Timeline = () => {
    const { colors } = useTheme();
    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    return (
        <Screen>
            <Banner name="Timeline" leftIcon={'search-circle-outline'} leftRoute='UserSearch' />

            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={textStyle}>welcome to the embtr. timeline!</Text>
            </View>
        </Screen>
    );
}
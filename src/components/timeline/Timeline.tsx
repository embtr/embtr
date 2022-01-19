import * as React from 'react';
import { Text, TextStyle, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { TimelineElement } from 'src/components/timeline/TimelineElement';

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
                <View style={{marginTop:10, marginBottom:10}}>
                    <TimelineElement title='Welcome 👋' body={"Welcome to embtr.! We cannot wait for you to reach your wildest dreams alongside us. Come on inside and say hello!"} />
                </View>
            </View>
        </Screen>
    );
}
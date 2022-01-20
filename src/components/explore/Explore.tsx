import * as React from 'react';
import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { TimelineElement } from 'src/components/timeline/TimelineElement';

export const Explore = () => {

    return (
        <Screen>
            <Banner name="Explore" />

            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={{ marginTop: 1 }}>
                    <TimelineElement title='Welcome 👋' body={"Welcome to embtr.! We cannot wait for you to reach your wildest dreams alongside us. Come on inside and say hello!"} />
                </View>
            </View>
        </Screen>
    );
}
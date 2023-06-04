import { View, Text } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { createEmbtrMenuOptions } from 'src/components/common/menu/EmbtrMenuOption';
import React from 'react';

export const ChallengeMain = () => {
    return (
        <Screen>
            <View>
                <Banner name={'Challenges'} />
            </View>
        </Screen>
    );
};

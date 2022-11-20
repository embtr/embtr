import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { getRandomInt } from 'src/util/GeneralUtility';

interface Props {
    options: string[];
}

export const DynamicPlaceholder = ({ options }: Props) => {
    const [currentPlaceholder, setCurrentPlaceholder] = React.useState<string>(options[getRandomInt(0, options.length - 1)]);

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                let x = -1;
                while (x === -1) {
                    let newIndex = getRandomInt(0, options.length - 1);
                    if (options[newIndex] !== currentPlaceholder) {
                        x = newIndex;
                    }
                }
                setCurrentPlaceholder(options[x]);
            }, 6000);
        }, [currentPlaceholder])
    );

    return <View />;
};

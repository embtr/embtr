import { Text, View } from 'react-native';
import { TutorialIslandTooltipData } from 'src/model/TutorialIslandModels';
import { useTheme } from '../theme/ThemeProvider';
import { PADDING_LARGE, PADDING_SMALL } from 'src/util/constants';
import { getWindowWidth } from 'src/util/GeneralUtility';
import React from 'react';

interface Props {
    tooltip: TutorialIslandTooltipData;
    parentWidth: number;
}

export const TutorialIslandTooltip = ({ tooltip, parentWidth }: Props) => {
    const colors = useTheme().colors;
    const PADDING = parentWidth / 2 - 10.5;

    return (
        <View
            style={{
                position: 'absolute',
                zIndex: 1,
                backgroundColor: colors.widget_element_background,
                alignSelf: tooltip.position,
                bottom: PADDING_LARGE * 4,
                borderRadius: 6,
            }}
        >
            <View
                style={{
                    borderLeftWidth: 10,
                    borderRightWidth: 10,
                    borderBottomWidth: 15,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: colors.widget_element_background,
                    position: 'absolute',
                    alignSelf: tooltip.position,
                    left: tooltip.position === 'flex-start' ? PADDING : undefined,
                    right: tooltip.position === 'flex-end' ? PADDING : undefined,
                    bottom: -15,
                    transform: [{ rotate: '180deg' }],
                }}
            />
            <Text
                style={{
                    minWidth: getWindowWidth() * 0.4,
                    maxWidth: getWindowWidth() * 0.4,
                    color: colors.text,
                    padding: PADDING_SMALL,
                }}
            >
                {tooltip.text}
            </Text>
        </View>
    );
};

import { Text, View } from 'react-native';
import { TutorialIslandTooltipData } from 'src/model/TutorialIslandModels';
import { useTheme } from '../theme/ThemeProvider';
import { PADDING_MEDIUM, PADDING_SMALL, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { getWindowWidth } from 'src/util/GeneralUtility';
import React from 'react';

interface Props {
    tooltip: TutorialIslandTooltipData;
    parentWidth: number;
    parentHeight: number;
}

export const TutorialIslandTooltip = ({ tooltip, parentWidth, parentHeight }: Props) => {
    const colors = useTheme().colors;
    const PADDING = parentWidth / 2 - 10.5;

    if (parentWidth === 0 || parentHeight === 0) {
        return null;
    }

    const textWidth = tooltip.text.length * 7;
    const maxWidth = getWindowWidth() * 0.5;
    const width = textWidth > maxWidth ? maxWidth : textWidth;

    return (
        <View
            pointerEvents="none"
            style={{
                position: 'absolute',
                zIndex: 1,
                backgroundColor: colors.text,
                alignSelf: tooltip.position,
                bottom: parentHeight + 15,
                borderRadius: 9,
                right: tooltip.position === 'flex-end' ? PADDING / 2 : undefined,
                left: tooltip.position === 'flex-start' ? PADDING / 2 : undefined,
            }}
        >
            <View
                style={{
                    borderLeftWidth: 10,
                    borderRightWidth: 10,
                    borderBottomWidth: 15,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: colors.text,
                    position: 'absolute',
                    alignSelf: tooltip.position,
                    left: tooltip.position === 'flex-start' ? PADDING / 2 : undefined,
                    right: tooltip.position === 'flex-end' ? PADDING / 2 : undefined,
                    bottom: -15,
                    transform: [{ rotate: '180deg' }],
                }}
            />
            <Text
                style={{
                    color: colors.accent_color,
                    padding: PADDING_SMALL,
                    fontFamily: POPPINS_MEDIUM,
                    width: width,
                }}
            >
                {tooltip.text}
            </Text>
        </View>
    );
};

import { Text, View, TouchableOpacity } from 'react-native';
import {
    TooltipPosition,
    TutorialIslandTooltipData,
} from 'src/model/tutorial_island/TutorialIslandModels';
import { useTheme } from '../theme/ThemeProvider';
import { PADDING_LARGE, PADDING_MEDIUM, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { getWindowWidth } from 'src/util/GeneralUtility';
import React from 'react';
import { isNarrowDevice } from 'src/util/DeviceUtil';

interface Props {
    tooltip: TutorialIslandTooltipData;
    onDismiss?: () => void;
    parentWidth: number;
    parentHeight: number;
}

export const getTooltipTop = (tooltip: TutorialIslandTooltipData, parentHeight: number) => {
    const position = tooltip.position;
    return position === TooltipPosition.BOTTOM ? parentHeight + (tooltip.padding ?? 0) : undefined;
};

export const getTooltipBottom = (tooltip: TutorialIslandTooltipData, parentHeight: number) => {
    const position = tooltip.position;
    return position === TooltipPosition.TOP
        ? parentHeight + (tooltip.padding ?? 0)
        : position === TooltipPosition.CENTER
            ? 0
            : undefined;
};

export const TutorialIslandTooltip = ({ tooltip, onDismiss, parentWidth, parentHeight }: Props) => {
    const colors = useTheme().colors;
    const PADDING = parentWidth / 2 - 10.5;

    if (parentWidth === 0 || parentHeight === 0) {
        return null;
    }

    const narrowDevice = isNarrowDevice();
    const textSize = narrowDevice ? 12 : 14;

    const textWidth = tooltip.text.length * 7.5;
    const minWidth = 150;
    const maxWidth = getWindowWidth() * 0.55;
    const width = Math.min(Math.max(textWidth, minWidth), maxWidth);

    return (
        <View
            pointerEvents={tooltip.dismissableText ? undefined : 'none'}
            style={{
                position: 'absolute',
                zIndex: 100,
                backgroundColor: colors.text,
                alignSelf: tooltip.alignment,
                bottom: getTooltipBottom(tooltip, parentHeight),
                top: getTooltipTop(tooltip, parentHeight),
                borderRadius: 9,
                right: tooltip.alignment === 'flex-end' ? PADDING : undefined,
                left: tooltip.alignment === 'flex-start' ? PADDING / 2 : undefined,
                width: width,
            }}
        >
            <View
                style={{
                    borderLeftWidth: 10,
                    borderRightWidth: 10,
                    borderBottomWidth: 10,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: colors.text,
                    position: 'absolute',
                    alignSelf: tooltip.alignment,
                    left: tooltip.alignment === 'flex-start' ? PADDING / 2 : undefined,
                    right: tooltip.alignment === 'flex-end' ? PADDING / 2 : undefined,
                    bottom: tooltip.position === TooltipPosition.TOP ? -7.5 : undefined,
                    top: tooltip.position === TooltipPosition.BOTTOM ? -7.5 : undefined,
                    transform: [
                        tooltip.position === TooltipPosition.TOP
                            ? { rotate: '180deg' }
                            : { rotate: '0deg' },
                    ],
                }}
            />

            <Text
                style={{
                    color: '#141414',
                    padding: PADDING_MEDIUM,
                    fontFamily: POPPINS_MEDIUM,
                    fontSize: textSize,
                }}
            >
                {tooltip.text}
            </Text>

            {tooltip.dismissableText && (
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: PADDING_LARGE,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.accent_color_light,
                            paddingVertical: 5,
                            borderRadius: 6,
                        }}
                        onPress={() => {
                            console.log('dismiss');
                            onDismiss?.();
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontFamily: POPPINS_REGULAR,
                                color: colors.text,
                                paddingHorizontal: 12,
                                includeFontPadding: false,
                                alignSelf: 'center',
                            }}
                        >
                            {tooltip.dismissableText}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

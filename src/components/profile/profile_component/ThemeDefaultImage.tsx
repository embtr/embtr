import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import DEFAULT_LIGHT from 'assets/banner_light.png'; // Import default light image
import DEFAULT_DARK from 'assets/banner.png'; // Import default dark image
import { useTheme } from 'src/components/theme/ThemeProvider'; // Import useTheme hook

export const ThemeDefaultImage = (): JSX.Element => {
    const { isDark } = useTheme(); // Get the current theme

    // Determine the image source based on the theme
    const imageSource: ImageSourcePropType = isDark ? DEFAULT_DARK : DEFAULT_LIGHT;

    return (
        <Image
            source={imageSource}
            style={{
                width: '100%',
                height: '100%',
                borderRadius: 15,
            }}
        />
    );
};

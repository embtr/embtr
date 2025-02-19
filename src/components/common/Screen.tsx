import { View, StatusBar } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import * as NavigationBar from 'expo-navigation-bar';
import { isAndroidDevice } from 'src/util/DeviceUtil';

export const Screen = (props: { children: any }) => {
    const { children } = props;

    // Using the custom hook we made to pull the theme colors
    const { colors, isDark } = useTheme();

    if (isAndroidDevice()) {
        NavigationBar.setBackgroundColorAsync(colors.tab_bar_menu);
        NavigationBar.setButtonStyleAsync('light');
        //NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
    }

    return (
        <>
            {/* We can also use the isDark prop to set the statusbar style accordingly */}
            <StatusBar
                animated
                //barStyle={isDark ? 'light-content' : 'dark-content'}
                barStyle={'light-content'}
                backgroundColor={colors.background}
            />
            <View
                style={{
                    flex: 1,
                    overflow: 'scroll',
                    /*
                     * the colors.background_heavy value will change dynamicly with
                     * so if we wanna change its value we can go directly to the pallet
                     * this will make super easy to change and maintain mid or end project
                     */
                    backgroundColor: colors.background,
                }}
            >
                {children}
            </View>
        </>
    );
};

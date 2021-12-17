import React from 'react';
import { StyleSheet } from 'react-native'
import { AppearanceProvider } from 'react-native-appearance';
import { Message } from './src/components/home/message';
import { Screen } from './src/components/home/screen';
import { ThemeProvider } from './src/components/theme/ThemeProvider';
import { Logo } from './src/components/home/logo';
import { Switchh } from './src/components/home/switch';

const styles = StyleSheet.create({
    box: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexGrow: 1,
        padding: 20,
    },
    image: { width: 200, height: 200 },
    text: { textAlign: 'center', fontWeight: 'bold' },
});

export default function App() {

    return (
        <React.StrictMode>
        <AppearanceProvider>
            <ThemeProvider>
                <Screen>
                    <Logo />
                    <Switchh />
                    <Message />
                </Screen>
            </ThemeProvider>
        </AppearanceProvider>
        </React.StrictMode>
    );
};
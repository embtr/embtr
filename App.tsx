import React from 'react';
import { StyleSheet } from 'react-native'
import { AppearanceProvider } from 'react-native-appearance';
import { Screen } from './src/components/home/screen';
import { ThemeProvider } from './src/components/theme/ThemeProvider';
import { Home } from './src/components/home/home';

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
                        <Home />
                    </Screen>
                </ThemeProvider>
            </AppearanceProvider>
        </React.StrictMode>
    );
};
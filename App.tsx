import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import { Screen } from './src/components/home/screen';
import { ThemeProvider } from './src/components/theme/ThemeProvider';
import { Home } from './src/components/home/home';

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
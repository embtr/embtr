import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import { ThemeProvider } from './src/components/theme/ThemeProvider';
import { Main } from './src/main';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, Store } from './src/redux/store';


export default function App() {
    return (
        <React.StrictMode>
            <Provider store={Store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AppearanceProvider>
                        <ThemeProvider>
                            <Main />
                        </ThemeProvider>
                    </AppearanceProvider>
                </PersistGate>
            </Provider>
        </React.StrictMode >
    );
};
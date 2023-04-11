import React from 'react';
import { ThemeProvider } from './src/components/theme/ThemeProvider';
import { Main } from './src/main';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, Store } from './src/redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HoldMenuProvider } from 'react-native-hold-menu';
import { RootSiblingParent } from 'react-native-root-siblings';

export default function App() {
    return (
        <React.StrictMode>
            <SafeAreaProvider>
                <Provider store={Store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <ThemeProvider>
                            <RootSiblingParent>
                                <Main />
                            </RootSiblingParent>
                        </ThemeProvider>
                    </PersistGate>
                </Provider>
            </SafeAreaProvider>
        </React.StrictMode>
    );
}

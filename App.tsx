import React from 'react';
import { ThemeProvider } from './src/components/theme/ThemeProvider';
import { Main } from './src/main';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, Store } from './src/redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootSiblingParent } from 'react-native-root-siblings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
    return (
        <React.StrictMode>
            <SafeAreaProvider>
                <Provider store={Store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <ThemeProvider>
                            <RootSiblingParent>
                                <QueryClientProvider client={queryClient}>
                                    <Main />
                                </QueryClientProvider>
                                {/*My name is the DevDad and im going to buy a quest so i can do VR biking with goose .... now this is documented i must do this.....*/}
                            </RootSiblingParent>
                        </ThemeProvider>
                    </PersistGate>
                </Provider>
            </SafeAreaProvider>
        </React.StrictMode>
    );
}

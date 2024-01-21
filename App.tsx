import React from 'react';
import { ThemeProvider } from './src/components/theme/ThemeProvider';
import { reactQueryClient } from './src/react_query/ReactQueryClient';
import { Main } from './src/main';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, Store } from './src/redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootSiblingParent } from 'react-native-root-siblings';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';

/*
 * "ABANDON ALL HOPE YE WHO ENTER HERE" - loganmbutler - 2023-11-29
 */

Sentry.init({
    dsn: 'https://113b0875ab8ad4fe2f5a644c010fbfa9@o4506605790560256.ingest.sentry.io/4506605798359040',
    debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

const App = () => {
    LogBox.ignoreAllLogs();

    return (
        <React.StrictMode>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaProvider>
                    <Provider store={Store}>
                        <PersistGate loading={null} persistor={persistor}>
                            <ThemeProvider>
                                <RootSiblingParent>
                                    <QueryClientProvider client={reactQueryClient}>
                                        <Main />
                                    </QueryClientProvider>
                                    {/*My name is the DevDad and im going to buy a quest so i can do VR biking with goose .... now this is documented i must do this.....*/}
                                </RootSiblingParent>
                            </ThemeProvider>
                        </PersistGate>
                    </Provider>
                </SafeAreaProvider>
            </GestureHandlerRootView>
        </React.StrictMode>
    );
};

export default Sentry.wrap(App);

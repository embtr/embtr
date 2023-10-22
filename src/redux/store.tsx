import { createStore } from '@reduxjs/toolkit';
import { createTransform, persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reducer from 'src/redux/Reducer';
import { hydrateDates } from 'src/util/DateUtility';

// convert dates from perisit into Date objects
function postProcessObject<T>(data: T): T {
    const copy: T = { ...data };
    const processedObject: T = hydrateDates(copy);

    return processedObject;
}

const trasformDates = createTransform(null, (outboundState, key) => {
    return postProcessObject(outboundState);
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    transforms: [trasformDates],
};

const persistedReducer = persistReducer(persistConfig, Reducer);

export const Store = createStore(persistedReducer);
export const persistor = persistStore(Store);

export type AppDispatch = typeof Store.dispatch;
export type RootState = ReturnType<typeof Store.getState>;

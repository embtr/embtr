import { createStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reducer from 'src/redux/reducer';

const persistConfig = {
    key: "root",
    storage: AsyncStorage
};

const persistedReducer = persistReducer(persistConfig, Reducer);

export const Store = createStore(persistedReducer);
export const persistor = persistStore(Store);

export type AppDispatch = typeof Store.dispatch;
export type RootState = ReturnType<typeof Store.getState>;
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/redux/store";

const INVALID_USER: User = {
    uid: undefined,
    displayName: undefined,
    email: undefined,
    profileUrl: undefined
};

export interface User {
    uid?: string,
    displayName?: string,
    email?: string,
    profileUrl?: string
}

const initialState: User = INVALID_USER;

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            state.uid = action.payload.uid;
            state.displayName = action.payload.displayName;
            state.email = action.payload.email;
            state.profileUrl = action.payload.profileUrl;
        },
        clearUser(state) {
            state.uid = undefined;
            state.displayName = undefined;
            state.email = undefined;
            state.profileUrl = undefined;
        }
    }
});

export const getUser = (state: RootState): User => {
    return {
        uid: state.user.uid,
        displayName: state.user.displayName,
        email: state.user.email,
        profileUrl: state.user.profileUrl,
    }
};

export const userIsSet = (state: RootState): boolean => {
    const user = getUser(state);
    const userIsInvalid =
        user.uid === INVALID_USER.uid
        && user.displayName === INVALID_USER.displayName
        && user.email === INVALID_USER.email
        && user.profileUrl === INVALID_USER.profileUrl;

    return !userIsInvalid;
}

export const createUserObject = (uid: string, displayName: string, email: string, profileUrl: string) => {
    return {
        uid: uid,
        displayName: displayName,
        email: email,
        profileUrl: profileUrl
    }
}

export const { setUser, clearUser } = UserSlice.actions;
export default UserSlice.reducer;
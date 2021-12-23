import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/redux/store";

const INVALID_USER: User = {
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    profileUrl: undefined
};

export interface User {
    firstName?: string,
    lastName?: string,
    email?: string,
    profileUrl?: string
}

const initialState: User = INVALID_USER;

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.email = action.payload.email;
            state.profileUrl = action.payload.profileUrl;
        },
        clearUser(state) {
            state.firstName = undefined;
            state.lastName = undefined;
            state.email = undefined;
            state.profileUrl = undefined;
        }
    }
});

export const getUser = (state: RootState) => {
    return {
        firstName: state.user.firstName,
        lastName: state.user.lastName,
        email: state.user.email,
        profileUrl: state.user.profileUrl,
    }
};

export const userIsSet = (state: RootState): boolean => {
    const user = getUser(state);
    const userIsInvalid =
        user.firstName === INVALID_USER.firstName
        && user.lastName === INVALID_USER.lastName
        && user.email === INVALID_USER.email
        && user.profileUrl === INVALID_USER.profileUrl;

    return !userIsInvalid;
}

export const createUserObject = (firstName: string, lastName: string, email: string, profileUrl: string) => {
    return {
        firstName: firstName,
        lastName: lastName,
        email: email,
        profileUrl: profileUrl
    }
}

export const { setUser, clearUser } = UserSlice.actions;
export default UserSlice.reducer;
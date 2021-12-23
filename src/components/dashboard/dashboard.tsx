import * as React from 'react';
import { useAppDispatch } from "src/redux/hooks";
import { clearUser } from "src/redux/user/UserSlice";

export const Dashboard = () => {
    const dispatch = useAppDispatch();

    const onLogout = () => {
        dispatch(clearUser());
        alert("You have successfully logged out.");
    }

    return (
        <div>
            dashboard !
        </div>
    )
};
import { combineReducers } from "redux";
import UserSlice from "src/redux/user/UserSlice";

export default combineReducers({
    user: UserSlice
});
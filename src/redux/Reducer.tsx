import { combineReducers } from "redux";
import { GlobalState } from "./user/GlobalState";
import { HabitState } from "./habit/HabitState";

export default combineReducers({
    globalState: GlobalState.reducer,
    habitState: HabitState.reducer,
});
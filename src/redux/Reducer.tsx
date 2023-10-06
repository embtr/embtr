import { combineReducers } from 'redux';
import { GlobalState } from './user/GlobalState';
import { HabitState } from './habit/HabitState';
import { CreateEditScheduledHabitState } from 'src/redux/habit/CreateEditScheduledHabitState';

export default combineReducers({
    globalState: GlobalState.reducer,
    habitState: HabitState.reducer,
    createEditScheduledHabitState: CreateEditScheduledHabitState.reducer,
});

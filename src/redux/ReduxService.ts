import { Store } from './store';

export namespace ReduxService {
  export enum ReduxKey {
    SELECTED_DAY_KEY = 'selectedDayKey',
  }
  export const get = (key: ReduxKey) => {
    const reduxState = Store.getState()['globalState'];
    return reduxState[key];
  };
}

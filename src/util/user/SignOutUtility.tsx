import UserController from 'src/controller/user/UserController';
import { getAuth } from 'firebase/auth';
import { useAppDispatch } from 'src/redux/Hooks';
import { resetToDefault } from 'src/redux/user/GlobalState';

export namespace SignOutCustomHooks {
    export const useSignOut = () => {
        const dispatch = useAppDispatch();
        const signOut = async () => {
            dispatch(resetToDefault());
            await UserController.refreshToken();
            await getAuth().signOut();
        };

        return signOut;
    };
}

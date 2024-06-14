import { getAuth } from 'firebase/auth';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
//import { RevenueCat } from 'src/controller/revenuecat/RevenueCat';
import { useAppDispatch } from 'src/redux/Hooks';
import { resetToDefault } from 'src/redux/user/GlobalState';

export namespace SignOutCustomHooks {
    export const useSignOut = () => {
        const dispatch = useAppDispatch();
        const signOut = async () => {
            dispatch(resetToDefault());
            //RevenueCat.logout();
            await getAuth().signOut();
            reactQueryClient.clear();
        };

        return signOut;
    };
}

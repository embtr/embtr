import { getAuth } from 'firebase/auth';
import { RevenueCatProvider } from 'src/controller/revenuecat/RevenueCatProvider';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { useAppDispatch } from 'src/redux/Hooks';
import { resetPoints, resetToDefault } from 'src/redux/user/GlobalState';

export namespace SignOutCustomHooks {
    export const useSignOut = () => {
        const dispatch = useAppDispatch();
        const signOut = async () => {
            dispatch(resetToDefault());
            dispatch(resetPoints());
            RevenueCatProvider.get().logout();
            await getAuth().signOut();
            reactQueryClient.clear();
        };

        return signOut;
    };
}

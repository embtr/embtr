import { getAuth } from 'firebase/auth';
import { RevenueCatProvider } from 'src/controller/revenuecat/RevenueCatProvider';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { useAppDispatch } from 'src/redux/Hooks';
import { resetToDefault } from 'src/redux/user/GlobalState';

export namespace SignOutCustomHooks {
    export const useSignOut = () => {
        const dispatch = useAppDispatch();

        const signOut = async () => {
            await getAuth().signOut();

            dispatch(resetToDefault());
            RevenueCatProvider.get().logout();
            reactQueryClient.clear();
        };

        return signOut;
    };
}

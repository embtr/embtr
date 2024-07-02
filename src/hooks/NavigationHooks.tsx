import { Route, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MasterScreens, TutorialIslandScreens } from 'src/navigation/RootStackParamList';

export const useEmbtrNavigation = () => {
    const navigation = useNavigation<StackNavigationProp<MasterScreens>>();
    return navigation;
};

export const useEmbtrRoute = <
    TRoute extends keyof MasterScreens,
    TParams extends MasterScreens[TRoute],
>(
    route: TRoute
): Route<TRoute, TParams> => {
    return useRoute() as Route<TRoute, TParams>;
};

export const useEmbtrTutorialIslandNavigation = () => {
    const navigation = useNavigation<StackNavigationProp<TutorialIslandScreens>>();
    return navigation;
};

export const useEmbtrTutorialIslandRoute = <
    TRoute extends keyof TutorialIslandScreens,
    TParams extends TutorialIslandScreens[TRoute],
>(
    route: TRoute
): Route<TRoute, TParams> => {
    return useRoute() as Route<TRoute, TParams>;
};

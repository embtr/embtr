import { ParamListBase, Route, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MasterScreens, TimelineTabScreens } from 'src/navigation/RootStackParamList';

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

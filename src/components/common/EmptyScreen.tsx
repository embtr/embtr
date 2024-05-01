import { View } from 'react-native';
import { Screen } from './Screen';

export const EmptyScreen = () => {
    return (
        <Screen>
            <View style={{ flex: 1 }} />
        </Screen>
    );
};

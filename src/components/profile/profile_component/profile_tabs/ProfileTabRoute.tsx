import { View } from 'react-native';
import { DailyHistoryWidget } from 'src/components/widgets/daily_history/DailyHistoryWidget';
import { User } from 'resources/schema';

interface Props {
    newUser: User;
}

export const ProfileTabRoute = ({ newUser }: Props) => {
    return <View style={{ paddingBottom: 5 }}>{newUser.id && <View style={{ width: '100%' }}>{<DailyHistoryWidget userId={newUser.id} />}</View>}</View>;
};

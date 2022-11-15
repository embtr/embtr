import { View, Text } from 'react-native';

export const UserProfileProBadge = () => {
    return (
        <View style={{ width: 38, paddingTop:3, paddingBottom:3, backgroundColor: '#F14C6B', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 10.5, fontFamily: 'Poppins_600SemiBold', color: 'white' }}>PRO</Text>
        </View>
    );
};

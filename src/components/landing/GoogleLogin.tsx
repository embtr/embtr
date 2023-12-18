import { TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';

interface Props {
    onPress: Function;
}

export const GoogleLogin = ({ onPress }: Props) => {
    const height = 40 * 1.035;
    const width = 175 * 1.035;

    return (
        <TouchableOpacity
            onPress={() => {
                onPress();
            }}
        >
            <View
                style={{
                    height: 45,
                    width: 300,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F2F2F2',
                    borderRadius: 5,
                }}
            >
                <Image
                    source={require('../../../assets/google_login.svg')}
                    style={{ height, width }}
                />
            </View>
        </TouchableOpacity>
    );
};

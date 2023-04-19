import { useTheme } from 'src/components/theme/ThemeProvider';
import { View, Image } from 'react-native';
import { useAppSelector } from 'src/redux/Hooks';
import { getUserProfileImage } from 'src/redux/user/GlobalState';

interface Props {
    size: number;
}

export const UserTabElement = ({ size }: Props) => {
    const { colors } = useTheme();

    const userProfileImage = useAppSelector(getUserProfileImage);

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <View
                style={{
                    width: size + 2,
                    height: size + 2,
                    borderRadius: 50,
                    backgroundColor: colors.tab_bar_menu,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Image style={{ width: size, height: size, borderRadius: 50 }} source={{ uri: userProfileImage }} />
            </View>
        </View>
    );
};

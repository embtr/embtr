import { View, Image } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserCustomHooks } from 'src/controller/user/UserController';
import { Ionicons } from '@expo/vector-icons';
import { UserPropertyUtil } from 'src/util/UserPropertyUtil';

interface Props {
    size: number;
}

export const UserTabElement = ({ size }: Props) => {
    const { colors } = useTheme();
    const currentUser = UserCustomHooks.useCurrentUser();
    const userIsAway = currentUser.data ? UserPropertyUtil.isAway(currentUser.data) : false;

    return (
        <View
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
            }}
        >
            {userIsAway && (
                <View
                    style={{
                        zIndex: 1,
                        position: 'absolute',
                        top: 0,
                        right: size / 2,
                    }}
                >
                    <Ionicons name={'airplane-sharp'} size={8} color={colors.link} />
                </View>
            )}

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
                <Image
                    style={{ width: size, height: size, borderRadius: 50 }}
                    source={{ uri: currentUser.data?.photoUrl }}
                />
            </View>
        </View>
    );
};

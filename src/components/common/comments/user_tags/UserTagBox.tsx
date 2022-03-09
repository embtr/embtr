import { getAuth } from 'firebase/auth';
import * as React from 'react';
import { Text, View } from 'react-native';
import { UserTag } from 'src/components/common/comments/user_tags/UserTag';
import { useTheme } from 'src/components/theme/ThemeProvider';
import ProfileController from 'src/controller/profile/ProfileController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

interface Props {
    input: string
}

export const UserTagBox = ({ input }: Props) => {
    const { colors } = useTheme();

    const [user, setUser] = React.useState<UserProfileModel>();
    const [display, setDisplay] = React.useState<boolean>(false);

    React.useEffect(() => {
        ProfileController.getProfile(getAuth().currentUser!.uid, setUser);
    }, []);

    if (!display && input.charAt(input.length - 1) == "@") {

        setDisplay(true);
    }

    return (
        display
            ?
            (
                <View style={{ padding: 1, backgroundColor: colors.background_secondary, borderWidth: 1, borderColor: colors.background,borderRadius: 5 }} >
                    {user && <UserTag userProfile={user} />}
                    {user && <UserTag userProfile={user} />}
                    {user && <UserTag userProfile={user} />}
                    {user && <UserTag userProfile={user} />}
                </View >
            )
            :
            (
                <View />
            )
    )
}
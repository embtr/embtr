import * as React from 'react';
import { getAuth } from 'firebase/auth';
import { View } from 'react-native';
import { UserTag } from 'src/components/common/comments/user_tags/UserTag';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UsernameTagTracker } from 'src/util/user/UsernameTagTracker';
import UserSearchResultObject from 'src/firebase/firestore/user/UserSearchResultObject';
import { UserProfileModel } from 'src/model/OldModels';

interface Props {
    input: string;
    userTagged: Function;
}

export const UserTagBox = ({ input, userTagged }: Props) => {
    const { colors } = useTheme();

    const [user, setUser] = React.useState<UserProfileModel>();
    const [display, setDisplay] = React.useState<boolean>(false);

    React.useEffect(() => {}, []);

    React.useEffect(() => {
        const username = UsernameTagTracker.getUsernameFromText(input);
    }, [input]);

    const isTypingUsername = UsernameTagTracker.isTypingUsername(input);

    if (!display && isTypingUsername) {
        setDisplay(true);
    } else if (display && !isTypingUsername) {
        setDisplay(false);
    }

    let usernameTagOptionsViews: JSX.Element[] = [];

    return display ? (
        <View style={{ padding: 1, backgroundColor: colors.background_medium, borderWidth: 1, borderColor: colors.background_heavy, borderRadius: 5 }}>
            {usernameTagOptionsViews}
        </View>
    ) : (
        <View />
    );
};

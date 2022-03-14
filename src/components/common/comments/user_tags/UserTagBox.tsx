import * as React from 'react';
import { getAuth } from 'firebase/auth';
import { View } from 'react-native';
import { UserTag } from 'src/components/common/comments/user_tags/UserTag';
import { useTheme } from 'src/components/theme/ThemeProvider';
import ProfileController from 'src/controller/profile/ProfileController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { UserSearchUtility } from 'src/util/user/UserSearchUtility';
import { UsernameTagTracker } from 'src/util/user/UsernameTagTracker';
import UserSearchResultObject from 'src/firebase/firestore/user/UserSearchResultObject';

interface Props {
    input: string,
    userTagged: Function
}

export const UserTagBox = ({ input, userTagged }: Props) => {
    const { colors } = useTheme();

    const [userSearchUtility, setUserSearchUtility] = React.useState<UserSearchUtility | undefined>(undefined);
    const [usernameTagOptions, setUsernameTagOptions] = React.useState<UserProfileModel[]>([]);

    React.useEffect(() => {
        setUserSearchUtility(new UserSearchUtility());
    }, []);

    const [user, setUser] = React.useState<UserProfileModel>();
    const [display, setDisplay] = React.useState<boolean>(false);

    React.useEffect(() => {
        ProfileController.getProfile(getAuth().currentUser!.uid, setUser);
    }, []);

    React.useEffect(() => {
        const username = UsernameTagTracker.getUsernameFromText(input);
        if (username) {
            userSearchUtility?.updateSearch(username, (results: UserSearchResultObject) => {
                if (results?.results) {
                    setUsernameTagOptions(results.results);
                }
            });
        }
    }, [input]);

    const isTypingUsername = UsernameTagTracker.isTypingUsername(input);

    if (!display && isTypingUsername) {
        setDisplay(true);
    } else if (display && !isTypingUsername) {
        setDisplay(false);
    }

    let usernameTagOptionsViews: JSX.Element[] = [];
    if (usernameTagOptions) {
        usernameTagOptions.forEach(usernameTagOption => {
            usernameTagOptionsViews.push(<UserTag userProfile={usernameTagOption} onPress={userTagged} />);
        });
    }

    return (
        display ?
            (<View style={{ padding: 1, backgroundColor: colors.background_secondary, borderWidth: 1, borderColor: colors.background, borderRadius: 5 }} >
                {usernameTagOptionsViews}
            </View >)
            :
            (<View />)
    )
}
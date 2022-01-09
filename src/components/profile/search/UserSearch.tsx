import * as React from 'react';
import { SafeAreaView, TextInput, View } from 'react-native';
import { Screen } from 'src/components/common/screen';
import { Banner } from 'src/components/common/Banner';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';
import UsersController from 'src/controller/user/UsersController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { UserSearchResults } from 'src/components/profile/search/UserSearchResults';

export const UserSearch = () => {
    const { colors } = useTheme();

    const [searchText, setSearchText] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<UserProfileModel[]>([]);

    const onSearchChange = (text: string) => {
        setSearchText(text);
        UsersController.getUsersByDisplayName(text, (results: UserProfileModel[]) => {
            setSearchResults(results);
            console.log(searchResults);
        });
    }

    return (
        <Screen>
            <SafeAreaView style={{ flex: 1 }}>
                <Banner name='User Search' leftIcon={"arrow-back"} leftRoute="Timeline" />


                <View style={{ alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", width:"60%" }} >
                        <View style={{ position: "absolute", zIndex: 1, paddingTop: 30, paddingLeft: 18 }} >
                            <Ionicons name={'search'} size={22} color={colors.text} />
                        </View>
                        <TextInput
                            style={{ marginTop: 30, paddingLeft: 60, height: 40, width:"100%", borderColor: 'white', borderWidth: 1, borderRadius: 50, color: colors.text, fontSize: 20 }}
                            onChangeText={onSearchChange}
                            value={searchText}
                            placeholder={"enter search"}
                        />
                    </View>
                    <View>
                        <UserSearchResults searchResults={searchResults} />
                    </View>
                </View>
            </SafeAreaView>
        </Screen>

    );
}
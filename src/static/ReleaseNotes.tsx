import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, TextStyle, ViewStyle, Image, Button } from "react-native";
import { Screen } from 'src/components/common/Screen';
import { useTheme } from "src/components/theme/ThemeProvider";
import { RootStackParamList } from "src/navigation/RootStackParamList";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { color } from "react-native-reanimated";
import ReleaseNotesController, { ReleaseNotesModel } from "src/controller/release_notes/ReleaseNotesController";

type landingPageScreenProp = StackNavigationProp<RootStackParamList, 'LandingPage'>;

export const ReleaseNotes = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<landingPageScreenProp>();

    const [releaseNotes, setReleaseNotes] = React.useState<ReleaseNotesModel[]>([]);
    useFocusEffect(
        React.useCallback(() => {
            ReleaseNotesController.getAll(setReleaseNotes);
        }, [])
    );

    let releaseNotesView: JSX.Element[] = [];
    releaseNotes.forEach(releaseNote => {
        console.log(releaseNote);
        releaseNotesView.push(
            <View key={releaseNote.id}>
                <Text style={{ color: colors.text }}>{releaseNote.version}</Text>
                <Text style={{ color: colors.text }}>{releaseNote.notes}</Text>
            </View>
        );
    });

    return (
        <Screen>
            <View style={{ alignContent: "center", alignItems: "center", flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: 24 }}>Release Notes</Text>
                <Image source={require('../../assets/logo.png')} style={{ width: 200, height: 200 }} />
                <View>
                    {releaseNotesView}
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Button title='home' onPress={() => { navigation.navigate('LandingPage') }}></Button>
            </View>
        </Screen>
    )
};
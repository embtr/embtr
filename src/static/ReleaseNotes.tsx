import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { TouchableOpacity, View, Text, TextStyle, ViewStyle, Image, Button, StyleSheet } from "react-native";
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
    let orderedReleaseNotes = releaseNotes.sort((a, b) => (a.version > b.version) ? 1 : -1).reverse();
    
    releaseNotes.forEach(releaseNote => {
        const notes = releaseNote.notes;
        
        const bulletedNotes = notes.map((notes) => <li>{notes}</li>);
        releaseNotesView.push(
            <View key={releaseNote.id}>
                <Text style={{ color: colors.text }}>{releaseNote.version}</Text>
                <ul>
                    <Text style={{ color: colors.text }}>{bulletedNotes}</Text>
                </ul>
            </View>
        );
    });
    
    
    return (
        <Screen>
            <View style={styles.container}>
                <Text style={{ color: colors.text, fontSize: 22 }}>
                    Release Notes
                </Text>
                <View>
                    {releaseNotesView}
                </View>
                <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('LandingPage') }}>
                    <Image source={require('../../assets/logo.png')} style={{ width: 40, height: 40 }} />
                    <Text style={{ color: colors.text, fontSize: 12 }}>
                        home
                    </Text>
                </TouchableOpacity>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
        flexDirection: "column"
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "pointer"
    }
});
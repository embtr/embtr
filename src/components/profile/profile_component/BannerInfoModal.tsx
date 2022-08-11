import { Picker } from '@react-native-picker/picker';
import * as React from 'react';
import { View, TouchableOpacity, Modal, Text, Linking } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';


interface Props {
    visible: boolean,
    dismiss: Function
}

export const BannerInfoModal = ({ visible, dismiss }: Props) => {
    const { colors } = useTheme();

    const [duration, setDuration] = React.useState(30);

    let hourPickerItems: JSX.Element[] = [];
    for (let i = 1; i <= 12; i++) {
        hourPickerItems.push(<Picker.Item key={"hour_" + i} color={colors.text} label={"" + i} value={i} />);
    }

    let minutePickerItems: JSX.Element[] = [];
    for (let i = 0; i <= 59; i += 15) {
        let val = "" + i;
        if (i < 10) {
            val = "0" + i;
        }
        minutePickerItems.push(<Picker.Item key={"minute_" + val} color={colors.text} label={"" + val} value={i} />);
    }

    let amPmPickerItems: JSX.Element[] = [];
    amPmPickerItems.push(<Picker.Item key={"amPm_am"} color={colors.text} label={"AM"} value={"am"} />);
    amPmPickerItems.push(<Picker.Item key={"amPm_pm"} color={colors.text} label={"PM"} value={"pm"} />);

    let durationPickerItems: JSX.Element[] = [];
    for (let i = 5; i <= 180; i += 5) {
        durationPickerItems.push(<Picker.Item key={"duration_" + i} color={colors.text} label={"" + i} value={i} />);
    }

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_400Regular,
        Poppins_500Medium
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <View>
            <Modal visible={visible} transparent={true} animationType={"fade"} >
                <View style={{ position: "absolute", zIndex: 1, height: "100%", width: "100%", backgroundColor: "rgba(000,000,000,.6)" }}>
                    <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                        <View>
                            <View style={{ width: 300, backgroundColor: colors.modal_background, borderRadius: 12, justifyContent: "space-around" }}>
                                <View >
                                    <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 14, textAlign: "center", paddingTop: 3, color: colors.text }}>Upload Banner Info</Text>
                                    <View style={{ padding: 10 }}>
                                        <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 12, color: colors.text }}>A banner should contain a 3:1 aspect ratio.</Text>
                                        <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 12, color: colors.text }}>Example: 1500 x 500.</Text>
                                        <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 12, color: colors.text, paddingTop: 8 }}>You can use an online tool such as the one below to crop and save your image in a 3:1 aspect ratio!</Text>
                                        <Text style={{ fontFamily: "Poppins_400Regular", color: 'blue', textAlign: "center" }} onPress={() => Linking.openURL('https://redketchup.io/image-resizer')}>
                                            Cropping Tool
                                        </Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                        <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                    </View>
                    <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                </View>
            </Modal>
        </View>
    )
}
import React from 'react';
import { View, Text, Keyboard, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { Banner } from 'src/components/common/Banner';
import { isIosApp } from 'src/util/DeviceUtil';
import { Screen } from 'src/components/common/Screen';
import { StackNavigationProp } from '@react-navigation/stack';
import { PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';
import { Timestamp } from 'firebase/firestore';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { RandomPlaceHolderTextInput } from 'src/components/common/textbox/RandomPlaceholderTextInput';

export const CreateEditPillar = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [name, setName] = React.useState('');

    const placeholderOptions = ['Family', 'Health', 'Happiness', 'Education', 'Wealth'];

    /*
     * NOTE - Pillar only supports create for now.
     */

    const save = async () => {
        const pillarModal: PillarModel = {
            uid: getCurrentUid(),
            name: name,
            active: true,
            added: Timestamp.now(),
        };

        await PillarController.create(pillarModal);
        navigation.goBack();
    };

    return (
        <Screen>
            <Banner name={'Create Pillar'} leftText={'cancel'} leftRoute="BACK" rightText={'save'} rightOnClick={save} />
            <ScrollView scrollEnabled={true} contentContainerStyle={{ flexGrow: 1 }}>
                <KeyboardAvoidingView style={{ height: '100%' }} keyboardVerticalOffset={isIosApp() ? -10 : 111} behavior={isIosApp() ? 'padding' : 'height'}>
                    <View style={{ paddingTop: 5 }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, fontFamily: 'Poppins_600SemiBold', fontSize: 17, paddingTop: 10, paddingLeft: 15 }}
                        >
                            Live your most fulfilling life.
                        </Text>

                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{
                                color: colors.secondary_text,
                                fontFamily: 'Poppins_400Regular',
                                paddingTop: 10,
                                fontSize: 12,
                                paddingLeft: 15,
                                paddingRight: 15,
                            }}
                        >
                            Create a Pillar. A Pillar is a core value of yours. It is a belief that shapes who you are today and what you are becoming.
                        </Text>
                    </View>

                    {/* Name */}
                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, paddingTop: 15, paddingLeft: 5, width: '95%', paddingBottom: 5, fontFamily: 'Poppins_400Regular' }}
                        >
                            Pillar
                        </Text>
                        <RandomPlaceHolderTextInput value={name} onChangeValue={setName} placeholderOptions={placeholderOptions} />
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </Screen>
    );
};

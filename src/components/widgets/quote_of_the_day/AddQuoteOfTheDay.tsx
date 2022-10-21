import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import QuoteOfTheDayController, { QuoteOfTheDayModel } from 'src/controller/widgets/quote_of_the_day/QuoteOfTheDayController';
import { POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { isIosApp } from 'src/util/DeviceUtil';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodayTab } from 'src/navigation/RootStackParamList';

export const AddQuoteOfTheDay = () => {
    const { colors } = useTheme();

    const [quote, setQuote] = React.useState('');
    const [author, setAuthor] = React.useState('');

    const navigation = useNavigation<StackNavigationProp<TodayTab, 'PlanDay'>>();

    const save = async () => {
        const quoteModel: QuoteOfTheDayModel = QuoteOfTheDayController.create(quote, author);
        await QuoteOfTheDayController.save(quoteModel);
        navigation.goBack();
    };

    return (
        <Screen>
            <Banner name="Add New Quote" leftText="back" leftRoute="BACK" rightText="save" rightOnClick={save} />
            <ScrollView style={{ width: '100%', height: '100%' }}>
                <KeyboardAvoidingView style={{ height: '100%' }} keyboardVerticalOffset={isIosApp() ? -10 : 111} behavior={isIosApp() ? 'padding' : 'height'}>
                    <TouchableWithoutFeedback
                        style={{ height: '100%' }}
                        onPress={() => {
                            Keyboard.dismiss();
                        }}
                    >
                        <View style={{ width: '95%', paddingLeft: 5, paddingTop: 20 }}>
                            <View>
                                <Text style={{ fontFamily: POPPINS_MEDIUM, color: colors.text, fontSize: 15 }}>Welcome to the Quote Of The Day Widget!</Text>
                                <Text style={{ fontFamily: POPPINS_REGULAR, color: colors.text, fontSize: 12, paddingTop: 5 }}>
                                    Add a new quote for the chance to be featured as the Quote Of The Day!
                                </Text>
                            </View>
                            <View style={{ height: 30, width: '100%' }} />

                            <View style={{ width: '100%' }}>
                                <Text style={{ fontFamily: POPPINS_REGULAR, color: colors.text }}>Quote</Text>
                                <TextInput
                                    textAlignVertical="top"
                                    style={{
                                        marginTop: 3,
                                        width: '100%',
                                        height: 200,
                                        borderRadius: 12,
                                        backgroundColor: colors.text_input_background,
                                        borderColor: colors.text_input_border,
                                        borderWidth: 1,
                                        color: colors.text,
                                        paddingTop: 10,
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                    }}
                                    multiline={true}
                                    placeholder={'add a quote that inspires you!'}
                                    placeholderTextColor={colors.secondary_text}
                                    onChangeText={setQuote}
                                    value={quote}
                                />
                            </View>

                            <View style={{ width: '100%', paddingTop: 10 }}>
                                <Text style={{ fontFamily: POPPINS_REGULAR, color: colors.text }}>Author</Text>
                                <TextInput
                                    style={{
                                        marginTop: 3,
                                        padding: 15,
                                        color: colors.text,
                                        borderRadius: 12,
                                        backgroundColor: colors.text_input_background,
                                        borderColor: colors.text_input_border,
                                        borderWidth: 1,
                                    }}
                                    placeholder={"Author's Name (Optional)"}
                                    placeholderTextColor={colors.secondary_text}
                                    onChangeText={setAuthor}
                                    value={author}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </ScrollView>
        </Screen>
    );
};

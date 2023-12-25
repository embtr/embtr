import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { TextInput } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { QuoteOfTheDayController } from 'src/controller/widget/quote_of_the_day/QuoteOfTheDayController';
import { isIosApp } from 'src/util/DeviceUtil';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

export const AddQuoteOfTheDay = () => {
    const { colors } = useTheme();

    const [quote, setQuote] = React.useState('');
    const [author, setAuthor] = React.useState('');

    const navigation = useNavigation<StackNavigationProp<TodayTab, 'PlanDay'>>();

    const save = async () => {
        await QuoteOfTheDayController.create(quote, author);
        navigation.goBack();
    };

    return (
        <Screen>
            <Banner
                name="Add New Quote"
                leftText="back"
                leftRoute="BACK"
                rightText="save"
                rightOnClick={save}
                rightEnabled={quote.length > 0}
                rightColor={quote.length > 0 ? colors.link : 'gray'}
            />

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={isIosApp() ? 'padding' : 'height'}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ padding: 20, flex: 1 }}>
                        {/* <View style={{ padding: 24, flex: 1, justifyContent: 'space-around' }}> 
                        Justify content will add a ton of whitespace around each view which will collapse the view. */}
                        <View style={{ paddingBottom: 40 }}>
                            <View style={{ backgroundColor: '#282828', borderRadius: 5 }}>
                                <Text
                                    style={{
                                        fontFamily: POPPINS_REGULAR,
                                        color: colors.text,
                                        fontSize: 13,
                                        padding: TIMELINE_CARD_PADDING,
                                    }}
                                >
                                    Add a quote that inspires you! Once a day we randomly select a
                                    quote to inspire the entire community.{' '}
                                    <Text
                                        style={{ color: colors.accent_color_light, paddingTop: 5 }}
                                    >
                                        Yours could be next!
                                    </Text>
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontFamily: POPPINS_REGULAR, color: colors.text }}>
                                Quote
                            </Text>
                            {quote.length < 1 && (
                                <Text
                                    style={{
                                        color: colors.tab_selected,
                                        paddingLeft: TIMELINE_CARD_PADDING,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 10,
                                        textAlignVertical: 'center',
                                    }}
                                >
                                    cannot be blank
                                </Text>
                            )}
                        </View>

                        <View style={{ paddingBottom: 20 }}>
                            <TextInput
                                textAlignVertical="top"
                                style={{
                                    marginTop: 3,
                                    height: 120,
                                    borderRadius: 5,
                                    backgroundColor: '#282828',
                                    color: colors.text,
                                    padding: TIMELINE_CARD_PADDING / 2,
                                }}
                                multiline={true}
                                placeholder={'add a quote that inspires you!'}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setQuote}
                                value={quote}
                            />
                        </View>

                        <View style={{ paddingTop: 10 }}>
                            <Text style={{ fontFamily: POPPINS_REGULAR, color: colors.text }}>
                                Author
                            </Text>
                            <TextInput
                                style={{
                                    marginTop: 3,
                                    padding: TIMELINE_CARD_PADDING,
                                    color: colors.text,
                                    borderRadius: 5,
                                    backgroundColor: '#282828',
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
        </Screen>
    );
};

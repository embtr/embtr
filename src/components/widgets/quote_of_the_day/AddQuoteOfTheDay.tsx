import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { TextInput } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';
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

    const styles = {
        container: {
            backgroundColor: '#282828',
            color: colors.text,
            padding: PADDING_LARGE,
            borderRadius: 5,
            fontFamily: POPPINS_REGULAR,
        },
        layout: {
            flex: 1,
            padding: 20,
        },
        text: {
            color: colors.text,
            fontFamily: POPPINS_REGULAR,
            fontSize: 13,
        },
        header: {
            fontSize: 15,
        },
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
                    <View
                        style={[styles.layout, { justifyContent: 'flex-start', marginBottom: 25 }]}
                    >
                        <View style={{ paddingBottom: 40 }}>
                            <View style={[styles.container]}>
                                <Text style={[styles.text]}>
                                    Add a quote that inspires you! Once a day we randomly select a
                                    quote to inspire the entire community.{' '}
                                    <Text style={{ color: colors.accent_color_light }}>
                                        Yours could be next!
                                    </Text>
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.text, styles.header]}>Quote</Text>
                        </View>

                        <View style={{ paddingBottom: 20 }}>
                            <TextInput
                                textAlignVertical="top"
                                style={[styles.container, { height: 120 }]}
                                multiline={true}
                                placeholder={'add a quote that inspires you!'}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setQuote}
                                value={quote}
                            />
                        </View>

                        <View style={{ paddingTop: 10 }}>
                            <Text style={[styles.text, styles.header]}>Author</Text>
                            <TextInput
                                style={[styles.container]}
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
